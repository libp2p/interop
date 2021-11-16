'use strict'

const { expect } = require('aegir/utils/chai')

module.exports = async (daemons, ids) => {
  const identify1 = await daemons[0].client.identify()
  const identify2 = await daemons[1].client.identify()

  // Verify ids
  expect(identify1.peerId.toB58String()).to.eql(ids[0])
  expect(identify2.peerId.toB58String()).to.eql(ids[1])

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
}
