/* eslint-env mocha */
'use strict'

const connectTest = require('../test')
const spawnDaemons = require('../../utils/spawnDaemons')

describe('connect (secp256k1)', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, [
      { type: 'js', keyType: 'secp256k1' },
      { type: 'go', keyType: 'secp256k1' }
    ])
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('js peer to go peer', function () {
    this.timeout(10 * 1000)

    return connectTest(daemons)
  })
})
