/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-checkmark'))
const expect = chai.expect

const spawnDaemons = require('../../utils/spawnDaemons')

describe('dht.peerRouting', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(3, 'js', { dht: true })
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('js peer to js peer', async function () {
    const identify1 = await daemons[1].client.identify()
    const identify2 = await daemons[2].client.identify()

    // peers need at least one peer in their routing table or they fail with:
    // connect 0 => 1
    await daemons[0].client.connect(identify1.peerId, identify1.addrs)

    // connect 0 => 2
    await daemons[0].client.connect(identify2.peerId, identify2.addrs)

    // daemons[0] will take some time to have the peers in the routing table
    await new Promise(resolve => setTimeout(resolve, 1000))

    // peer 1 find peer 2
    const peerInfo = await daemons[1].client.dht.findPeer(identify2.peerId)

    expect(peerInfo.multiaddrs.toArray()).to.have.deep.members(identify2.addrs)
  })
})
