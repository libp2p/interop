import type { DaemonFactory } from '../index.js'
import { contentFetchingTests } from './content-fetching.js'
import { contentRoutingTests } from './content-routing.js'
import { peerRoutingTests } from './peer-routing.js'

export async function dhtTests (factory: DaemonFactory): Promise<void> {
  contentFetchingTests(factory)
  contentRoutingTests(factory)
  peerRoutingTests(factory)
}
