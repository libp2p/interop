/* eslint-env mocha */

import { expect } from 'aegir/utils/chai.js'
import { CID } from 'multiformats/cid'
import all from 'it-all'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import type { IdentifyResult } from '@libp2p/daemon-client'

export function contentRoutingTests (factory: DaemonFactory) {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      if (typeA === 'go' && typeB === 'go') {
        // skip go<->go as it never seems to populate the routing tables
        continue
      }

      runContentRoutingTests(
        factory,
        { type: typeA, dht: true },
        { type: typeB, dht: true }
      )
    }
  }
}

function runContentRoutingTests (factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions) {
  describe('dht.contentRouting', () => {
    let daemons: Daemon[]
    let identify: IdentifyResult[]

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB),
        factory.spawn(optionsB)
      ])

      identify = await Promise.all(
        daemons.map(async d => await d.client.identify())
      )

      await daemons[0].client.connect(identify[1].peerId, identify[1].addrs)
      await daemons[0].client.connect(identify[2].peerId, identify[2].addrs)

      // get the peers in the table
      await new Promise(resolve => setTimeout(resolve, 1000))
    })

    // Stop daemons
    after(async function () {
      if (daemons != null) {
        await Promise.all(
          daemons.map(async (daemon) => await daemon.stop())
        )
      }
    })

    it(`${optionsA.type} peer to ${optionsB.type} peer`, async function () {
      const cid = CID.parse('QmVzw6MPsF96TyXBSRs1ptLoVMWRv5FCYJZZGJSVB2Hp39')

      await daemons[0].client.dht.provide(cid)

      const providers = await all(daemons[1].client.dht.findProviders(cid, 1))

      expect(providers).to.exist()
      expect(providers.length).to.be.greaterThan(0)
    })
  })
}
