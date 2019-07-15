'use strict'

const assert = require('assert')
const path = require('path')

const Daemon = require('../../src/daemon')

const startPortNumber = 9000

/**
 * @param {number} n number of nodes to spawn
 * @param {string|array} specs node specs (default: 'js')
 * @param {Object|array} options daemon options
 */
async function spawnDaemons (n, specs = 'js', options) {
  assert(n, 'spawnDaemons require a number of nodes to start')

  if (!Array.isArray(specs)) {
    specs = new Array(n).fill(specs)
  }
  specs = specs.map((spec) => {
    if (typeof spec === 'string') {
      return {
        type: spec
      }
    }

    return spec
  })
  validateSpecs(n, specs)

  let daemonOptions = options
  if (!Array.isArray(daemonOptions)) {
    daemonOptions = new Array(n).fill(options)
  }

  const daemons = []
  for (let i = 0; i < n; i++) {
    const spec = specs[i]
    const daemon = new Daemon(spec.type, `/tmp/p2pd-${i}.sock`, startPortNumber + i)
    daemons.push(daemon)
  }

  await Promise.all(daemons.map((daemon, i) => {
    const spec = specs[i]
    const opts = daemonOptions[i] || {}
    opts.keyFile = spec.keyType != null
      ? path.resolve(__dirname, `../resources/keys/${spec.type}.${spec.keyType}.key`) : null
    return daemon.start(opts)
  }))

  return daemons
}

function validateSpecs (n, specs) {
  assert(specs.length === n, 'number of specs must be equal to n')

  specs.forEach((spec) => {
    assert(['js', 'go'].includes(spec.type), `invalid spec type ${spec.type}`)
    assert([undefined, null, 'rsa', 'secp256k1'].includes(spec.keyType),
      `invalid spec key type ${spec.keyType}`)
  })
}

module.exports = spawnDaemons
