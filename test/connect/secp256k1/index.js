'use strict'

// SECIO
require('./go2js')('secio', { secio: true, noise: false })
require('./js2go')('secio', { secio: true, noise: false })

// NOISE
require('./go2js')('noise', { secio: false, noise: true })
require('./js2go')('noise', { secio: false, noise: true })
