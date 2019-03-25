/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const Daemon = require('../../src/daemon')

describe('connect', () => {
  let goDaemon1
  let goDaemon2

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    goDaemon1 = new Daemon('go')
    goDaemon2 = new Daemon('go', '/tmp/p2pd-go2.sock', 9090)

    await Promise.all([
      goDaemon1.start(),
      goDaemon2.start()
    ])
  })

  // Stop daemons
  after(async function () {
    await Promise.all([
      goDaemon1.stop(),
      goDaemon2.stop()
    ])
  })

  it('go peer to go peer', async function () {
    this.timeout(10 * 1000)

    const identify1 = await goDaemon1.client.identify()
    const identify2 = await goDaemon2.client.identify()

    // verify connected peers
    const knownPeersBeforeConnect1 = await goDaemon1.client.listPeers()
    expect(knownPeersBeforeConnect1).to.have.lengthOf(0)

    const knownPeersBeforeConnect2 = await goDaemon2.client.listPeers()
    expect(knownPeersBeforeConnect2).to.have.lengthOf(0)

    // connect peers
    await goDaemon2.client.connect(identify1.peerId, identify1.addrs)

    // verify connected peers
    const knownPeersAfterConnect1 = await goDaemon1.client.listPeers()
    expect(knownPeersAfterConnect1).to.have.lengthOf(1)
    expect(knownPeersAfterConnect1[0].toB58String()).to.equal(identify2.peerId.toB58String())

    const knownPeersAfterConnect2 = await goDaemon2.client.listPeers()
    expect(knownPeersAfterConnect2).to.have.lengthOf(1)
    expect(knownPeersAfterConnect2[0].toB58String()).to.equal(identify1.peerId.toB58String())
  })
})
