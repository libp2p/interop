'use strict'

const debug = require('debug')
const log = debug('daemon')

const assert = require('assert')
const execa = require('execa')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const Client = require('libp2p-daemon-client')
const { getMultiaddr, isWindows, DEFAULT_CONFIG } = require('./utils')

// process path
const processPath = process.cwd()

// go-libp2p defaults
const goDaemon = {
  defaultAddr: getMultiaddr('/tmp/p2pd-go.sock'),
  bin: process.env.LIBP2P_GO_BIN || path.join('go-libp2p-dep', 'go-libp2p', isWindows ? 'p2pd.exe' : 'p2pd')
}

// js-libp2p defaults
const jsDaemon = {
  defaultAddr: getMultiaddr('/tmp/p2pd-js.sock'),
  bin: process.env.LIBP2P_JS_BIN || path.join('libp2p-daemon', 'src', 'cli', 'bin.js')
}

class Daemon {
  /**
   * @constructor
   * @param {String} type daemon implementation type ("go" or "js")
   * @param {Multiaddr} addr multiaddr for the client to connect to
   * @param {Number} port port for the client to connect to
   */
  constructor (type, addr, port) {
    assert(type === 'go' || type === 'js', 'invalid type received. Should be "go" or "js"')

    this._client = undefined
    this._type = type
    this._binPath = this._getBinPath(type)
    this._addr = addr && getMultiaddr(addr, port)

    if (!this._addr) {
      this._addr = type === 'go' ? goDaemon.defaultAddr : jsDaemon.defaultAddr
    }
  }

  /**
   * Get binary path according to implementation and OS
   * @private
   * @param {String} type daemon implementation type ("go" or "js")
   * @returns {String}
   */
  _getBinPath (type) {
    const depPath = type === 'go' ? goDaemon.bin : jsDaemon.bin
    if (fs.existsSync(depPath)) {
      return depPath
    }

    let npmPath = path.join(processPath, '../', depPath)

    if (fs.existsSync(npmPath)) {
      return npmPath
    }

    npmPath = path.join(processPath, 'node_modules', depPath)

    if (fs.existsSync(npmPath)) {
      return npmPath
    }

    throw new Error('Cannot find the libp2p executable')
  }

  /**
   * @async
   * Starts a daemon and a client associated with it.
   * @param {Object} options daemon options
   * @param {bool} options.dht dht enabled (false)
   * @param {bool} options.pubsub pubsub enabled (false)
   * @returns {void}
   */
  async start (options = {}) {
    if (this._client) {
      throw new Error('Daemon has already started')
    }

    // start daemon
    await this._startDaemon(options)

    // start client
    this._client = new Client(this._addr)
  }

  /**
   * Starts the specifiec daemon and wait for its start.
   * @private
   * @param {Object} options daemon options
   * @param {bool} options.dht dht enabled (false)
   * @param {bool} options.pubsub pubsub enabled (false)
   * @returns {Promise}
   */
  _startDaemon (options) {
    options = { ...DEFAULT_CONFIG, ...options }
    return new Promise((resolve, reject) => {
      let execOptions
      const addr = this._addr.toString()

      // TODO refactor this once we daemon supports a json config
      if (this._type === 'go') {
        execOptions = ['-listen', addr]

        execOptions.push(`-secio=${options.secio}`)
        execOptions.push(`-noise=${options.noise}`)
        options.dht && execOptions.push('-dht')
        options.pubsub && execOptions.push('-pubsub')
        options.pubsubRouter && execOptions.push('-pubsubRouter', options.pubsubRouter)
      } else {
        execOptions = ['--listen', addr]

        execOptions.push(`--secio=${options.secio}`)
        execOptions.push(`--noise=${options.noise}`)
        options.dht && execOptions.push('--dht')
        options.pubsub && execOptions.push('--pubsub')
        options.pubsubRouter && execOptions.push('--pubsubRouter', options.pubsubRouter)
      }
      if ((options.keyFile || '') !== '') {
        execOptions.push(`--id=${options.keyFile}`)
      }

      const daemon = execa(this._binPath, execOptions)

      daemon.stdout.once('data', () => {
        resolve()

        daemon.stdout.on('data', (data) => {
          log(data.toString())
        })
      })
      daemon.on('exit', (code, signal) => {
        if (code !== 0) {
          reject(new Error(`daemon exited with status code ${code}`))
        } else if ((signal || '') !== '') {
          reject(new Error(`daemon exited due to signal ${signal}`))
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @async
   * Stops the daemon client and cleans the unix socket.
   * @returns {void}
   */
  async stop () {
    await this._client && this._client.close()
    await this._cleanUnixSocket()
  }

  /**
   * Cleans the unix socket.
   * @private
   * @returns {Promise}
   */
  _cleanUnixSocket () {
    return new Promise((resolve, reject) => {
      const path = this._addr.getPath()
      if (!path) {
        return resolve()
      }

      rimraf(path, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  /**
   * libp2p client instance
   * @type {Client}
   */
  get client () {
    return this._client
  }
}

exports = module.exports = Daemon
