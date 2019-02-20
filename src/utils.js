'use strict'

const os = require('os')
const path = require('path')
const isWindows = os.platform() === 'win32'

exports.isWindows = isWindows

exports.getSockPath = (sockPath) => isWindows
  ? path.join('\\\\?\\pipe', sockPath)
  : path.resolve(os.tmpdir(), sockPath)
