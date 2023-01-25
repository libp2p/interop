/* eslint-env mocha */

import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import pRetry from 'p-retry'
import type { PeerInfo } from '@libp2p/interface-peer-info'

export function peerRoutingTests (factory: DaemonFactory): void {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      runPeerRoutingTests(
        factory,
        { type: typeA, dht: true },
        { type: typeB, dht: true }
      )
    }
  }
}

function runPeerRoutingTests (factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions): void {
  describe('dht.peerRouting', () => {
    let daemons: Daemon[]

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB),
        factory.spawn(optionsB)
      ])
    })

    // Stop daemons
    after(async function () {
      if (daemons != null) {
        await Promise.all(
          daemons.map(async (daemon) => { await daemon.stop() })
        )
      }
    })

    it(`${optionsA.type} peer to ${optionsB.type} peer`, async function () {
      const identify1 = await daemons[1].client.identify()
      const identify2 = await daemons[2].client.identify()

      // peers need at least one peer in their routing table or they fail with:
      // connect 0 => 1
      await daemons[0].client.connect(identify1.peerId, identify1.addrs)

      // connect 0 => 2
      await daemons[0].client.connect(identify2.peerId, identify2.addrs)

      // peer 1 find peer 2, retry up to 10 times to allow the routing table to refresh
      const peerData: PeerInfo = await pRetry(async () => await daemons[1].client.dht.findPeer(identify2.peerId), { retries: 10 })

      expect(identify2.addrs.map(ma => ma.toString())).to.include.deep.members(peerData.multiaddrs.map(ma => ma.toString()))
    })
  })
}
