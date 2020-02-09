/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')

module.exports = (name, config) => {
  describe(`connect ${name}`, () => {
    let daemons

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)
      daemons = await spawnDaemons(2, 'js', config)
    })

    // Stop daemons
    after(async function () {
      await Promise.all(
        daemons.map((daemon) => daemon.stop())
      )
    })

    it('js peer to js peer', async function () {
      this.timeout(10 * 1000)

      const identify1 = await daemons[0].client.identify()
      const identify2 = await daemons[1].client.identify()

      // verify connected peers
      const knownPeersBeforeConnect1 = await daemons[0].client.listPeers()
      expect(knownPeersBeforeConnect1).to.have.lengthOf(0)

      const knownPeersBeforeConnect2 = await daemons[1].client.listPeers()
      expect(knownPeersBeforeConnect2).to.have.lengthOf(0)

      // connect peers
      await daemons[1].client.connect(identify1.peerId, identify1.addrs)

      // daemons[0] will take some time to get the peers
      await new Promise(resolve => setTimeout(resolve, 1000))

      // verify connected peers
      const knownPeersAfterConnect1 = await daemons[0].client.listPeers()
      expect(knownPeersAfterConnect1).to.have.lengthOf(1)
      expect(knownPeersAfterConnect1[0].toB58String()).to.equal(identify2.peerId.toB58String())

      const knownPeersAfterConnect2 = await daemons[1].client.listPeers()
      expect(knownPeersAfterConnect2).to.have.lengthOf(1)
      expect(knownPeersAfterConnect2[0].toB58String()).to.equal(identify1.peerId.toB58String())
    })
  })
}

