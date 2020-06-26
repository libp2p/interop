'use strict'

const os = require('os')
const path = require('path')
const ma = require('multiaddr')
const isWindows = os.platform() === 'win32'

exports.isWindows = isWindows

exports.getSockPath = (sockPath) => isWindows
  ? path.join('\\\\?\\pipe', sockPath)
  : path.resolve(os.tmpdir(), sockPath)

exports.getMultiaddr = (sockPath, port) => isWindows
  ? ma(`/ip4/0.0.0.0/tcp/${port || 8080}`)
  : ma(`/unix${path.resolve(os.tmpdir(), sockPath)}`)

exports.DEFAULT_CONFIG = {
  secio: false,
  noise: true,
  dht: false
}
