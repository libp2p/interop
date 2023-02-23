/* eslint-env mocha */

import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import first from 'it-first'
import pWaitFor from 'p-wait-for'
import type { IdentifyResult } from '@libp2p/daemon-client'

export function hybridTests (factory: DaemonFactory): void {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      runHybridTests(
        factory,
        { type: typeA, pubsub: true, pubsubRouter: 'floodsub' },
        { type: typeB, pubsub: true, pubsubRouter: 'gossipsub' }
      )
    }
  }
}

function runHybridTests (factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions): void {
  describe('pubsub.hybrid', () => {
    let daemons: Daemon[]
    let identify1: IdentifyResult

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB)
      ])

      identify1 = await daemons[1].client.identify()
      await daemons[0].client.connect(identify1.peerId, identify1.addrs)
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
      const topic = 'test-topic'
      const data = uint8ArrayFromString('test-data')

      const subscribeIterator = daemons[1].client.pubsub.subscribe(topic)
      const subscriber = async (): Promise<void> => {
        const message = await first(subscribeIterator)

        expect(message).to.exist()
        expect(message).to.have.property('data').that.equalBytes(data)
      }

      const publisher = async (): Promise<void> => {
        // wait for subscription stream
        await pWaitFor(async () => {
          const peers = await daemons[0].client.pubsub.getSubscribers(topic)
          return peers.map(p => p.toString()).includes(identify1.peerId.toString())
        })
        await daemons[0].client.pubsub.publish(topic, data)
      }

      return await Promise.all([
        subscriber(),
        publisher()
      ])
    })
  })
}
