import pWaitFor from 'p-wait-for'
import delay from 'delay'
import type { Daemon } from '../index.js'

/**
 * Wait for daemon a to see daemon b in it's subscriber list
 * for the passed topic
 */
export async function waitForSubscribed (topic: string, a: Daemon, b: Daemon): Promise<void> {
  const idB = await b.client.identify()

  // wait for subscription stream
  await pWaitFor(async () => {
    const peers = await a.client.pubsub.getSubscribers(topic)
    return peers.map(p => p.toString()).includes(idB.peerId.toString())
  }, {
    interval: 500
  })

  // wait for the gossipsub heartbeat to rebalance the mesh
  await delay(2000)
}
