/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const Daemon = require('../../src/daemon')

describe('connect', () => {
  let goDaemon
  let jsDaemon

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    goDaemon = new Daemon('go')
    jsDaemon = new Daemon('js')

    await goDaemon.start()
    await jsDaemon.start()
  })

  // Stop daemons
  after(async function () {
    await goDaemon.stop()
    await jsDaemon.stop()
  })

  it('go peer to js peer', async function () {
    this.timeout(10 * 1000)

    const identifyJs = await jsDaemon.client.identify()

    const knownPeersBeforeConnect = await goDaemon.client.listPeers()
    expect(knownPeersBeforeConnect).to.have.lengthOf(0)

    // connect peers
    await goDaemon.client.connect(identifyJs.peerId, identifyJs.addrs)

    const knownPeersAfterConnect = await goDaemon.client.listPeers()
    expect(knownPeersAfterConnect).to.have.lengthOf(1)
    expect(knownPeersAfterConnect[0].toB58String()).to.equal(identifyJs.peerId.toB58String())
  })
})
