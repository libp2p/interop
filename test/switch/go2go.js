/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const CID = require('cids')
const spawnDaemons = require('../utils/spawnDaemons')

const PeerInfo = require('peer-info')

describe('Checking protocols', () => {
  let daemons
  let identify0

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'go')

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

  it('go peer to go peer', async function () {
    this.timeout(30 * 1000)

    //const cid = new CID('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp39')

    let peerIDs = await daemons[0].client.listPeers()
    let peers = []
    for (let peerID of peerIDs) {
      peers.push(new PeerInfo.create(peerID))
    }

    expect(peers.length).to.not.equal(0)
    for (let peer of peers) {
      console.log(peers.protocols)
      expect(peers.protocols).to.exist()
    }
  })
})
