/* eslint-env mocha */
'use strict'

const connectTest = require('../test')
const spawnDaemons = require('../../utils/spawnDaemons')

describe('connect (RSA)', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, ['go', 'js'])
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go peer to js peer', function () {
    this.timeout(10 * 1000)

    return connectTest(daemons)
  })
})
