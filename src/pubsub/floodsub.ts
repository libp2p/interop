/* eslint-env mocha */

import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import first from 'it-first'
import { waitForSubscribed } from './utils.js'

export function floodsubTests (factory: DaemonFactory): void {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      runFloodsubTests(
        factory,
        { type: typeA, pubsub: true, pubsubRouter: 'floodsub' },
        { type: typeB, pubsub: true, pubsubRouter: 'floodsub' }
      )
    }
  }
}

function runFloodsubTests (factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions): void {
  describe('pubsub.floodSub', () => {
    let daemons: Daemon[]

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB)
      ])

      const [peerA, peerB] = daemons
      const identifyB = await peerB.client.identify()
      await peerA.client.connect(identifyB.peerId, identifyB.addrs)
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
      const [peerA, peerB] = daemons

      const subscription = await peerB.client.pubsub.subscribe(topic)
      const subscriber = async (): Promise<void> => {
        const message = await first(subscription.messages())

        expect(message).to.exist()
        expect(message).to.have.property('data').that.equalBytes(data)
      }

      const publisher = async (): Promise<void> => {
        await waitForSubscribed(topic, peerA, peerB)
        await peerA.client.pubsub.publish(topic, data)
      }

      return await Promise.all([
        subscriber(),
        publisher()
      ])
    })
  })
}
