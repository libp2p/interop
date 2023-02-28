import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import { Status } from './pb/index.js'
import { echoHandler, reserve } from './util.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { IdentifyResult } from '@libp2p/daemon-client'
import { handshake } from 'it-handshake'

export function relayTests (factory: DaemonFactory): void {
  const t: NodeType[] = ['go', 'js']
  t.forEach(a => { t.forEach(b => { t.forEach(r => { relayTest(factory, a, b, r) }) }) })
}

function relayTest (factory: DaemonFactory, aType: NodeType, bType: NodeType, relayType: NodeType): void {
  describe(`${aType} to ${bType} over relay ${relayType}`, () => {
    const opts: SpawnOptions[] = [
      { type: aType, noise: true, noListen: true },
      { type: bType, noise: true, noListen: true },
      { type: relayType, noise: true, relay: true }
    ]

    let aNode: Daemon
    let bNode: Daemon
    let relay: Daemon
    let bId: IdentifyResult
    let relayId: IdentifyResult
    let bAddrViaRelay: Multiaddr

    beforeEach(async function () {
      this.timeout(20 * 1000)
      aNode = await factory.spawn(opts[0])
      bNode = await factory.spawn(opts[1])
      relay = await factory.spawn(opts[2])

      ;[bId, relayId] = await Promise.all([bNode, relay].map(async d => await d.client.identify()))

      // construct a relay address
      bAddrViaRelay = multiaddr(`${relayId.addrs[0].toString()}/p2p/${relayId.peerId.toString()}/p2p-circuit/p2p/${bId.peerId.toString()}`)

      // connect b to the relay
      await bNode.client.connect(relayId.peerId, relayId.addrs)
    })

    afterEach(async function () {
      await Promise.all([aNode, bNode, relay].map(async d => {
        if (d != null) {
          await d.stop()
        }
      }))
    })

    it('connects', async () => {
      // b makes reservation on relay
      const reserveResponse = await reserve(bNode, relayId.peerId)
      expect(reserveResponse.status).to.eq(Status.OK)

      // a dials b through relay
      await aNode.client.connect(bId.peerId, [bAddrViaRelay])
      await new Promise(resolve => setTimeout(resolve, 500))
      const connectedPeers = await aNode.client.listPeers()
      expect(connectedPeers.filter(p => p.equals(bId.peerId))).to.have.length(1)

      // run an echo test
      await bNode.client.registerStreamHandler(echoHandler.protocol, echoHandler.handler)
      const stream = await aNode.client.openStream(bId.peerId, echoHandler.protocol)

      // send some data, read the response
      const input = uint8ArrayFromString('test')
      const shake = handshake(stream)
      shake.write(input)
      const output = await shake.read()

      expect(output?.subarray()).to.deep.equal(input)
    })

    it('fails to connect without a reservation', async () => {
      // a dials b through relay
      await expect(aNode.client.connect(bId.peerId, [bAddrViaRelay])).to.eventually.be.rejected
        .with.property('message').that.matches(/NO_RESERVATION/)
    })
  })
}
