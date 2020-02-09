'use strict'

// Perform tests against secio
require('./go2go')('secio', { secio: true, noise: false })
require('./go2js')('secio', { secio: true, noise: false })
require('./js2go')('secio', { secio: true, noise: false })
require('./js2js')('secio', { secio: true, noise: false })

// Perform tests against noise
require('./go2go')('noise', { secio: false, noise: true })
require('./go2js')('noise', { secio: false, noise: true })
require('./js2go')('noise', { secio: false, noise: true })
require('./js2js')('noise', { secio: false, noise: true })
