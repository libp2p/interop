'use strict'

const os = require('os')
const path = require('path')
const isWindows = Boolean(os.type().match(/windows/gi))

exports.getSockPath = (sockPath) => isWindows
  ? path.join('\\\\?\\pipe', sockPath)
  : path.resolve(os.tmpdir(), sockPath)
