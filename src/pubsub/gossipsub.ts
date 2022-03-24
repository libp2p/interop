/* eslint-env mocha */

import { expect } from 'aegir/utils/chai.js'
import type { Daemon, DaemonFactory, NodeType, SpawnOptions } from '../index.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import first from 'it-first'

export function gossipsubTests (factory: DaemonFactory) {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      runGossipsubTests(
        factory,
        { type: typeA, pubsub: true, pubsubRouter: 'gossipsub' },
        { type: typeB, pubsub: true, pubsubRouter: 'gossipsub' }
      )
    }
  }
}

function runGossipsubTests (factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions) {
  describe('pubsub.gossipsub', () => {
    let daemons: Daemon[]

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB)
      ])

      const identify1 = await daemons[1].client.identify()
      await daemons[0].client.connect(identify1.peerId, identify1.addrs)
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
      const topic = 'test-topic'
      const data = uint8ArrayFromString('test-data')

      const subscribeIterator = daemons[1].client.pubsub.subscribe(topic)
      const subscriber = async () => {
        const message = await first(subscribeIterator)

        expect(message).to.exist()
        expect(message).to.have.property('data').that.equalBytes(data)
      }

      const publisher = async () => {
        // wait for subscription stream
        await new Promise(resolve => setTimeout(resolve, 800))
        await daemons[0].client.pubsub.publish(topic, data)
      }

      return await Promise.all([
        subscriber(),
        publisher()
      ])
    })
  })
}
