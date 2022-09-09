import { echoStreamTests } from './echo.js'
import type { DaemonFactory } from '../index.js'

export async function streamTests (factory: DaemonFactory) {
  await echoStreamTests(factory, 'mplex')
  await echoStreamTests(factory, 'yamux')
}
