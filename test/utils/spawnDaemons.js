'use strict'

const assert = require('assert')

const Daemon = require('../../src/daemon')

/**
 * 
 * @param {number} n number of nodes to spawn
 * @param {string|array} type nodes type (default: js)
 */
async function spawnDaemons (n, type = 'js') {
  assert(n, 'spawnDaemons require a number of nodes to start')
  assert(validType(n, type), 'spawnDaemons type is not valid')

  let types = type

  if (!Array.isArray(types)) {
    types = new Array(n).fill(type)
  }

  const daemons = []
  let daemon

  for (let i = 0; i < n; i++) {
    daemon = new Daemon(types[i], `/tmp/p2pd-${i}.sock`)
    daemons.push(daemon)
  }

  await Promise.all(daemons.map((daemon) => daemon.start()))

  return daemons
}

function validType (n, type) {
  // validate string type
  if (typeof type === 'string' && (type === 'js' || type === 'go')) {
    return true
  }

  // validate array of types
  if (Array.isArray(type) && type.length === n &&
    !type.filter((t) => (t !== 'go' && t !== 'js')).length) {
    return true
  }

  return false
}

module.exports = spawnDaemons
