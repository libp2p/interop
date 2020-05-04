/* eslint-env mocha */
'use strict'

const connectTest = require('../test')
const spawnDaemons = require('../../utils/spawnDaemons')

describe('connect (ed25519)', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, [
      { type: 'js', keyType: 'ed25519' },
      { type: 'go', keyType: 'ed25519' }
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

    const ids = ['12D3KooWDaHkRyb4Nkf8L6WHbsWB9Krt491NDk8PaPGogXvj2pcY', '12D3KooWRqGdmFVwspgLBajUQacY1TrkBkAUqmjqjbHSFGEoZs9R']
    return connectTest(daemons, ids)
  })
})
