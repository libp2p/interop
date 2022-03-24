import type { DaemonFactory } from '../index.js'
import { floodsubTests } from './floodsub.js'
import { gossipsubTests } from './gossipsub.js'
import { hybridTests } from './hybrid.js'

export async function pubsubTests (factory: DaemonFactory) {
  await floodsubTests(factory)
  await gossipsubTests(factory)
  await hybridTests(factory)
}
