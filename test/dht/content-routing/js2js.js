/* eslint-env mocha */
'use strict'
const { expect } = require('aegir/utils/chai')

const { CID } = require('multiformats/cid')
const spawnDaemons = require('../../utils/spawnDaemons')

describe('dht.contentRouting', () => {
  let daemons
  let identify0

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'js', { dht: true })

    // connect them
    identify0 = await daemons[0].client.identify()

    await daemons[1].client.connect(identify0.peerId, identify0.addrs)

    // get the peers in the table
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('js peer to js peer', async function () {
    const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp39')

    await daemons[0].client.dht.provide(cid)

    const findProviders = daemons[1].client.dht.findProviders(cid)
    const providers = []

    for await (const provider of findProviders) {
      providers.push(provider)
    }

    expect(providers).to.exist()
    expect(providers[0]).to.exist()
    expect(providers[0].id.toB58String()).to.equal(identify0.peerId.toB58String())
  })
})
