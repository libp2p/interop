/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')
const { connect } = require('../utils/circuit')

describe.only('go circuit for go to go', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(3, 'go', { dht: true })
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go peer to go peer', async function () {
    this.timeout(10 * 1000)

    const a = await connect(daemons[0], daemons[1], daemons[2])

    console.log('circuitAddr', a)
  })
})
