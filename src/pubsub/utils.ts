import pWaitFor from 'p-wait-for'
import type { Daemon } from '..'

export async function waitForBothSubscribed (topic: string, a: Daemon, b: Daemon): Promise<void> {
  const idA = await a.client.identify()
  const idB = await b.client.identify()

  // wait for subscription stream
  await Promise.all([
    await pWaitFor(async () => {
      const peers = await a.client.pubsub.getSubscribers(topic)
      return peers.map(p => p.toString()).includes(idB.peerId.toString())
    }, {
      interval: 500
    }),
    await pWaitFor(async () => {
      const peers = await b.client.pubsub.getSubscribers(topic)
      return peers.map(p => p.toString()).includes(idA.peerId.toString())
    }, {
      interval: 500
    })
  ])
}
