/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const Daemon = require('../../src/daemon')

describe('connect', () => {
  let jsDaemon1
  let jsDaemon2

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    jsDaemon1 = new Daemon('js')
    jsDaemon2 = new Daemon('js', '/tmp/p2pd-js2.sock', 9090)

    await Promise.all([
      jsDaemon1.start(),
      jsDaemon2.start()
    ])
  })

  // Stop daemons
  after(async function () {
    await Promise.all([
      jsDaemon1.stop(),
      jsDaemon2.stop()
    ])
  })

  it('js peer to js peer', async function () {
    this.timeout(10 * 1000)

    const identify1 = await jsDaemon1.client.identify()
    const identify2 = await jsDaemon2.client.identify()

    // verify connected peers
    const knownPeersBeforeConnect1 = await jsDaemon1.client.listPeers()
    expect(knownPeersBeforeConnect1).to.have.lengthOf(0)

    const knownPeersBeforeConnect2 = await jsDaemon2.client.listPeers()
    expect(knownPeersBeforeConnect2).to.have.lengthOf(0)

    // connect peers
    await jsDaemon2.client.connect(identify1.peerId, identify1.addrs)

    // jsDaemon1 will take some time to get the peers
    await new Promise(resolve => setTimeout(resolve, 1000))

    // verify connected peers
    const knownPeersAfterConnect1 = await jsDaemon1.client.listPeers()
    expect(knownPeersAfterConnect1).to.have.lengthOf(1)
    expect(knownPeersAfterConnect1[0].toB58String()).to.equal(identify2.peerId.toB58String())

    const knownPeersAfterConnect2 = await jsDaemon2.client.listPeers()
    expect(knownPeersAfterConnect2).to.have.lengthOf(1)
    expect(knownPeersAfterConnect2[0].toB58String()).to.equal(identify1.peerId.toB58String())
  })
})
