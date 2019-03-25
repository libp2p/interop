'use strict'

const assert = require('assert')
const execa = require('execa')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const Client = require('libp2p-daemon-client')
const { getMultiaddr, isWindows } = require('./utils')

// process path
const processPath = process.cwd()

// go-libp2p defaults
const goDaemon = {
  defaultAddr: getMultiaddr('/tmp/p2pd-go.sock'),
  bin: path.join('go-libp2p-dep', 'go-libp2p', isWindows ? 'p2pd.exe' : 'p2pd')
}

// js-libp2p defaults
const jsDaemon = {
  defaultAddr: getMultiaddr('/tmp/p2pd-js.sock'),
  bin: path.join('libp2p-daemon', 'src', 'cli', 'bin.js')
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
   * @returns {void}
   */
  async start () {
    if (this._client) {
      throw new Error('Daemon has already started')
    }

    // start daemon
    await this._startDaemon()

    // start client
    this._client = new Client(this._addr)

    await this._client.attach()
  }

  /**
   * Starts the specifiec daemon and wait for its start.
   * @private
   * @returns {Promise}
   */
  _startDaemon () {
    return new Promise((resolve, reject) => {
      const options = this._type === 'go' ? ['-listen', `${this._addr}`] : ['--listen', this._addr]
      const daemon = execa(this._binPath, options)

      daemon.stdout.once('data', () => {
        return resolve()
      })
      daemon.stderr.once('data', (data) => {
        return reject(data.toString())
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
