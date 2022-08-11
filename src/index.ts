import { connectTests } from './connect.js'
import { dhtTests } from './dht/index.js'
import { pubsubTests } from './pubsub/index.js'
import type { DaemonClient } from '@libp2p/daemon-client'

export interface Daemon {
  stop: () => Promise<void>
  client: DaemonClient
}

export type NodeType = 'js' | 'go'
export type PeerIdType = 'rsa' | 'ed25519' | 'secp256k1'

export interface SpawnOptions {
  type: NodeType
  key?: string
  noise?: true
  dht?: boolean
  pubsub?: boolean
  pubsubRouter?: 'gossipsub' | 'floodsub'
}

export interface DaemonFactory {
  spawn: (options: SpawnOptions) => Promise<Daemon>
}

export async function interopTests (factory: DaemonFactory) {
  await connectTests(factory)
  await dhtTests(factory)
  await pubsubTests(factory)
}

export {
  connectTests as connectInteropTests,
  dhtTests as dhtInteropTests,
  pubsubTests as pubsubInteropTests
}
