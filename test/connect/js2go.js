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

    await Promise.all([
      jsDaemon.start(),
      goDaemon.start()
    ])
  })

  // Stop daemons
  after(async function () {
    await Promise.all([
      jsDaemon.stop(),
      goDaemon.stop()
    ])
  })

  it('js peer to go peer', async function () {
    this.timeout(10 * 1000)

    const identifyJs = await jsDaemon.client.identify()
    const identifyGo = await goDaemon.client.identify()

    // verify connected peers
    const knownPeersBeforeConnectJs = await jsDaemon.client.listPeers()
    expect(knownPeersBeforeConnectJs).to.have.lengthOf(0)

    const knownPeersBeforeConnectGo = await goDaemon.client.listPeers()
    expect(knownPeersBeforeConnectGo).to.have.lengthOf(0)

    // connect peers
    await jsDaemon.client.connect(identifyGo.peerId, identifyGo.addrs)

    // verify connected peers
    const knownPeersAfterConnectJs = await jsDaemon.client.listPeers()
    expect(knownPeersAfterConnectJs).to.have.lengthOf(1)
    expect(knownPeersAfterConnectJs[0].toB58String()).to.equal(identifyGo.peerId.toB58String())

    const knownPeersAfterConnectGo = await goDaemon.client.listPeers()
    expect(knownPeersAfterConnectGo).to.have.lengthOf(1)
    expect(knownPeersAfterConnectGo[0].toB58String()).to.equal(identifyJs.peerId.toB58String())
  })
})
