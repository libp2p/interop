'use strict'

const os = require('os')
const path = require('path')
const { Multiaddr } = require('multiaddr')
const isWindows = os.platform() === 'win32'

exports.isWindows = isWindows

exports.getSockPath = (sockPath) => isWindows
  ? path.join('\\\\?\\pipe', sockPath)
  : path.resolve(os.tmpdir(), sockPath)

exports.getMultiaddr = (sockPath, port) => isWindows
  ? new Multiaddr(`/ip4/0.0.0.0/tcp/${port || 8080}`)
  : new Multiaddr(`/unix${path.resolve(os.tmpdir(), sockPath)}`)

exports.DEFAULT_CONFIG = {
  noise: true,
  dht: false
}
