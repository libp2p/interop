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
    jsDaemon2 = new Daemon('js', '/tmp/p2pd-js2.sock')

    await jsDaemon1.start()
    await jsDaemon2.start()
  })

  // Stop daemons
  after(async function () {
    await jsDaemon1.stop()
    await jsDaemon2.stop()
  })

  it('js peer to js peer', async function () {
    this.timeout(10 * 1000)

    const identify1 = await jsDaemon1.client.identify()

    const knownPeersBeforeConnect = await jsDaemon2.client.listPeers()
    expect(knownPeersBeforeConnect).to.have.lengthOf(0)

    // connect peers
    await jsDaemon2.client.connect(identify1.peerId, identify1.addrs)

    const knownPeersAfterConnect = await jsDaemon2.client.listPeers()
    expect(knownPeersAfterConnect).to.have.lengthOf(1)
    expect(knownPeersAfterConnect[0].toB58String()).to.equal(identify1.peerId.toB58String())
  })
})
