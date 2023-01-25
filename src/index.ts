import { connectTests } from './connect.js'
import { dhtTests } from './dht/index.js'
import { pubsubTests } from './pubsub/index.js'
import { streamTests } from './streams/index.js'
import type { DaemonClient } from '@libp2p/daemon-client'

export interface Daemon {
  stop: () => Promise<void>
  client: DaemonClient
}

export type NodeType = 'js' | 'go'
export type PeerIdType = 'rsa' | 'ed25519' | 'secp256k1'
export type PubSubRouter = 'gossipsub' | 'floodsub'
export type Muxer = 'mplex' | 'yamux'

export interface SpawnOptions {
  type: NodeType
  key?: string
  noise?: true
  dht?: boolean
  pubsub?: boolean
  pubsubRouter?: PubSubRouter
  muxer?: Muxer
}

export interface DaemonFactory {
  spawn: (options: SpawnOptions) => Promise<Daemon>
}

export async function interopTests (factory: DaemonFactory): Promise<void> {
  connectTests(factory)
  await dhtTests(factory)
  await pubsubTests(factory)
  await streamTests(factory)
}

export {
  connectTests as connectInteropTests,
  dhtTests as dhtInteropTests,
  pubsubTests as pubsubInteropTests,
  streamTests as streamInteropTests
}
