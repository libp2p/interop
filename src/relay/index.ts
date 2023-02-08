import { multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import all from 'it-all'
import { pipe } from 'it-pipe'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import { Status } from './pb/index.js'
import { echoHandler, reserve } from './util.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import defer from 'p-defer'

export function relayTests (factory: DaemonFactory): void {
  const t: NodeType[] = ['go', 'js']
  t.forEach(a => { t.forEach(b => { t.forEach(r => { relayTest(factory, a, b, r) }) }) })
}

function relayTest (factory: DaemonFactory, aType: NodeType, bType: NodeType, relayType: NodeType): void {
  describe(`${aType} to ${bType} over relay ${relayType}`, () => {
    let daemons: Daemon[] = []
    const opts: SpawnOptions[] = [
      { type: aType, noise: true, noListen: true },
      { type: bType, noise: true, noListen: true },
      { type: relayType, noise: true, relay: true }
    ]

    before(async function () {
      this.timeout(20 * 1000)
      daemons = await Promise.all(opts.map(async o => await factory.spawn(o)))
    })

    after(async function () {
      await Promise.all(daemons.map(async d => { await d.stop() }))
    })

    it('connects', async () => {
      const aNode = daemons[0]
      const bNode = daemons[1]
      const identify = await Promise.all(daemons.map(async d => await d.client.identify()))
      const bId = identify[1]
      const relayId = identify[2]

      // connect receiver to the relay
      await bNode.client.connect(relayId.peerId, relayId.addrs)
      const reserveResponse = await reserve(bNode, relayId.peerId)
      expect(reserveResponse.status).to.eq(Status.OK)

      // construct a relay address
      const addr = multiaddr(`${relayId.addrs[0].toString()}/p2p/${relayId.peerId.toString()}/p2p-circuit/p2p/${bId.peerId.toString()}`)
      await aNode.client.connect(bId.peerId, [addr])
      await new Promise(resolve => setTimeout(resolve, 500))
      const connectedPeers = await aNode.client.listPeers()
      expect(connectedPeers.filter(p => p.equals(bId.peerId))).to.have.length(1)

      // run an echo test
      await bNode.client.registerStreamHandler(echoHandler.protocol, echoHandler.handler)
      const stream = await aNode.client.openStream(bId.peerId, echoHandler.protocol)

      // from the echo tests
      // without this the socket can close before we receive a response
      const responseReceived = defer()
      const input = [uint8ArrayFromString('test')]
      const output = await pipe(
        input,
        async function * (src) {
          yield * src
          await responseReceived.promise
        },
        stream,
        async function * (src) {
          for await (const buf of src) {
            yield buf.subarray()
            responseReceived.resolve()
          }
        },
        async (src) => await all(src)
      )
      expect(output).to.deep.equal(input)
    })
  })
}
