import type { DaemonFactory } from '../index.js'
import { contentFetchingTests } from './content-fetching.js'
import { contentRoutingTests } from './content-routing.js'
import { peerRoutingTests } from './peer-routing.js'

export async function dhtTests (factory: DaemonFactory) {
  await contentFetchingTests(factory)
  await contentRoutingTests(factory)
  await peerRoutingTests(factory)
}
