/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')

const beforeConnect = (ctx, keyType) => {
  ctx.timeout(20 * 1000)

  return spawnDaemons(2, [{ type: 'go', keyType }, { type: 'js', keyType }])
}

const afterConnect = async (daemons) => {
  if (daemons == null) {
    return
  }

  await Promise.all(
    daemons.map(async (daemon) => {
      // Ignore errors
      try {
        await daemon.stop()
      } catch (_) {
      }
    })
  )
}

const performTest = async (ctx, daemons) => {
  ctx.timeout(10 * 1000)

  const identifyGo = await daemons[0].client.identify()
  const goId = identifyGo.peerId.toB58String()
  const identifyJs = await daemons[1].client.identify()
  const jsId = identifyJs.peerId.toB58String()

  // verify connected peers
  const knownPeersBeforeConnectGo = await daemons[0].client.listPeers()
  expect(knownPeersBeforeConnectGo).to.have.lengthOf(0)

  const knownPeersBeforeConnectJs = await daemons[1].client.listPeers()
  expect(knownPeersBeforeConnectJs).to.have.lengthOf(0)

  // connect peers
  await daemons[0].client.connect(identifyJs.peerId, identifyJs.addrs)

  // Wait for connections to complete
  await new Promise(resolve => setTimeout(resolve, 250))

  // verify connected peers
  const knownPeersAfterConnectGo = await daemons[0].client.listPeers()
  expect(knownPeersAfterConnectGo).to.have.lengthOf(1)
  expect(knownPeersAfterConnectGo[0].toB58String()).to.equal(jsId)

  const knownPeersAfterConnectJs = await daemons[1].client.listPeers()
  expect(knownPeersAfterConnectJs).to.have.lengthOf(1)
  expect(knownPeersAfterConnectJs[0].toB58String()).to.equal(goId)
}

describe('connecting go peer to js peer', () => {
  describe('with RSA keys', () => {
    let daemons

    before(async function () {
      daemons = await beforeConnect(this, 'rsa')
    })

    after(async () => {
      await afterConnect(daemons)
    })

    it('should work', async function () {
      await performTest(this, daemons)
    })
  })

  describe('with SECP256k1 keys', () => {
    let daemons

    before(async function () {
      daemons = await beforeConnect(this, 'secp256k1')
    })

    after(async () => {
      await afterConnect(daemons)
    })

    it('should work', async function () {
      await performTest(this, daemons)
    })
  })

  describe('with ED25519 keys', () => {
    let daemons

    before(async function () {
      daemons = await beforeConnect(this, 'ed25519')
    })

    after(async () => {
      await afterConnect(daemons)
    })

    it('should work', async function () {
      await performTest(this, daemons)
    })
  })
})
