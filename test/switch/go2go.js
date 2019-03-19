/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const CID = require('cids')
const Switch = require('libp2p-switch')
const PeerInfo = require('peer-info')
const PeerBook = require('peer-book')
const multiplex = require('pull-mplex')

const spawnDaemons = require('../utils/spawnDaemons')

describe('Checking protocols', () => {
  let daemons
  let identify0
  let switch0
  let switch1


  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'go')

    // connect them
    /*identify0 = await daemons[0].client.identify()
    identify1 = await daemons[1].client.identify()
    console.log(daemons[0].client)

    await daemons[1].client.connect(identify0.peerId, identify0.addrs)
 
    switch0 = new Switch(new PeerInfo(idenitfy0.peerId), new PeerBook())
    switch1 = new Switch(new PeerInfo(identify1.peerId), new PeerBook())

    switch0.connection.addStreamMuxer(multiplex)
    switch1.connection.addStreamMuxer(multiplex)
*/

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

   let protocol = '/test/1.0.0'
   switch1.handle(protocol, () => { })

   switch0._peerBook.get(switch1._peerInfo).protocols.clear()

   const connFSM = switch0.dialFSM(switch1._peerInfo, protocol, (err) => {
     expect(err).to.not.exist()
   })

   connFSM.once('muxed', () => {
     const peer = switch0._peerBook.get(switch1._peerInfo)
     const protocols = Array.from(peer.protocols.values())
     expect(protocols).to.eql([
       multiplex.multicodec,
       identify.multicodec,
       protocol
     ])
     connFSM.close()
   })

   connFSM.once('close', done)

  })
})
