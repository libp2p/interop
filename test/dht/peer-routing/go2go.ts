/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')

import spawnDaemons from '../../utils/spawn-daemons.js'

describe('dht.peerRouting', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(3, 'go', { dht: true })
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go peer to go peer', async function () {
    const identify1 = await daemons[1].client.identify()
    const identify2 = await daemons[2].client.identify()

    // peers need at least one peer in their routing table or they fail with:
    // connect 0 => 1
    await daemons[0].client.connect(identify1.peerId, identify1.addrs)

    // connect 0 => 2
    await daemons[0].client.connect(identify2.peerId, identify2.addrs)

    // peer 1 find peer 2
    const peerData = await daemons[1].client.dht.findPeer(identify2.peerId)

    expect(peerData.addrs).to.have.deep.members(identify2.addrs)
  })
})
