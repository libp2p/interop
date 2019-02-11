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
    goDaemon2 = new Daemon('go', '/tmp/p2pd-go2.sock')

    await goDaemon1.start()
    await goDaemon2.start()
  })

  // Stop daemons
  after(async function () {
    await goDaemon1.stop()
    await goDaemon2.stop()
  })

  it('go peer to go peer', async function () {
    this.timeout(10 * 1000)

    const identify1 = await goDaemon1.client.identify()

    const knownPeersBeforeConnect = await goDaemon2.client.listPeers()
    expect(knownPeersBeforeConnect).to.have.lengthOf(0)

    // connect peers
    await goDaemon2.client.connect(identify1.peerId, identify1.addrs)

    const knownPeersAfterConnect = await goDaemon2.client.listPeers()
    expect(knownPeersAfterConnect).to.have.lengthOf(1)
    expect(knownPeersAfterConnect[0].toB58String()).to.equal(identify1.peerId.toB58String())
  })
})
