import { multiaddr } from '@multiformats/multiaddr'
import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '.'

export function relayTests (factory: DaemonFactory) {
  const t: NodeType[] = ['go', 'js']
  t.forEach(a => t.forEach(b => t.forEach(r => { if (a !== b || a !== r) relayTest(factory, a, b, r) })))
}

function relayTest (factory: DaemonFactory, aType: NodeType, bType: NodeType, relayType: NodeType) {
  describe(`${aType} to ${bType} over relay ${relayType}`, () => {
    if (factory.relay == null) {
      return
    }

    let daemons: Daemon[] = []
    const opts: SpawnOptions[] = [
      { type: aType, noise: true, noListen: true },
      { type: bType, noise: true, noListen: true },
      { type: relayType, noise: true, relay: true }
    ]

    beforeEach(async function () {
      this.timeout(20 * 1000)
      daemons = await Promise.all(opts.map(async o => await factory.spawn(o)))
    })

    afterEach(async function () {
      await Promise.all(daemons.map(async d => await d.stop()))
    })

    it('connects', async () => {
      const [aNode, bNode] = daemons
      const identify = await Promise.all(daemons.map(async d => await d.client.identify()))
      const bId = identify[1]
      const relayId = identify[2]

      // connect receiver to the relay
      await bNode.client.connect(relayId.peerId, relayId.addrs)
      await factory.relay?.reserve(bNode, relayId.peerId)

      // construct a relay address
      const addr = multiaddr(`${relayId.addrs[0].toString()}/p2p/${relayId.peerId.toString()}/p2p-circuit/p2p/${bId.peerId.toString()}`)
      await aNode.client.connect(bId.peerId, [addr])
      await new Promise(resolve => setTimeout(resolve, 500))
      const connectedPeers = await aNode.client.listPeers()
      expect(connectedPeers.filter(p => p.equals(bId.peerId))).to.have.length(1)
    })
  })
}
