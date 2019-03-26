/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')

describe('connect', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, ['js', 'go'])
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('js peer to go peer', async function () {
    this.timeout(10 * 1000)

    const identifyJs = await daemons[0].client.identify()
    const identifyGo = await daemons[1].client.identify()

    // verify connected peers
    const knownPeersBeforeConnectJs = await daemons[0].client.listPeers()
    expect(knownPeersBeforeConnectJs).to.have.lengthOf(0)

    const knownPeersBeforeConnectGo = await daemons[1].client.listPeers()
    expect(knownPeersBeforeConnectGo).to.have.lengthOf(0)

    // connect peers
    await daemons[0].client.connect(identifyGo.peerId, identifyGo.addrs)

    // verify connected peers
    const knownPeersAfterConnectJs = await daemons[0].client.listPeers()
    expect(knownPeersAfterConnectJs).to.have.lengthOf(1)
    expect(knownPeersAfterConnectJs[0].toB58String()).to.equal(identifyGo.peerId.toB58String())

    const knownPeersAfterConnectGo = await daemons[1].client.listPeers()
    expect(knownPeersAfterConnectGo).to.have.lengthOf(1)
    expect(knownPeersAfterConnectGo[0].toB58String()).to.equal(identifyJs.peerId.toB58String())
  })
})
