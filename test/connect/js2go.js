/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const Daemon = require('../../src/daemon')

describe('connect', () => {
  let jsDaemon
  let goDaemon

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    jsDaemon = new Daemon('js')
    goDaemon = new Daemon('go')

    await jsDaemon.start()
    await goDaemon.start()
  })

  // Stop daemons
  after(async function () {
    await jsDaemon.stop()
    await goDaemon.stop()
  })

  it('js peer to go peer', async function () {
    this.timeout(10 * 1000)

    const identifyGo = await goDaemon.client.identify()

    const knownPeersBeforeConnect = await jsDaemon.client.listPeers()
    expect(knownPeersBeforeConnect).to.have.lengthOf(0)

    // connect peers
    await jsDaemon.client.connect(identifyGo.peerId, identifyGo.addrs)

    const knownPeersAfterConnect = await jsDaemon.client.listPeers()
    expect(knownPeersAfterConnect).to.have.lengthOf(1)
    expect(knownPeersAfterConnect[0].toB58String()).to.equal(identifyGo.peerId.toB58String())
  })
})
