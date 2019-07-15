/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')

const beforeConnect = (ctx, keyType) => {
  ctx.timeout(20 * 1000)

  return spawnDaemons(2, [{ type: 'js', keyType }, { type: 'go', keyType }])
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

  const identifyJs = await daemons[0].client.identify()
  const jsId = identifyJs.peerId.toB58String()
  const identifyGo = await daemons[1].client.identify()
  const goId = identifyGo.peerId.toB58String()

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
  expect(knownPeersAfterConnectJs[0].toB58String()).to.equal(goId)

  const knownPeersAfterConnectGo = await daemons[1].client.listPeers()
  expect(knownPeersAfterConnectGo).to.have.lengthOf(1)
  expect(knownPeersAfterConnectGo[0].toB58String()).to.equal(jsId)
}

describe('connecting js peer to go peer', () => {
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
})
