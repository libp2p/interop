import { echoStreamTests } from './echo.js'
import type { DaemonFactory } from '../index.js'

export async function streamTests (factory: DaemonFactory): Promise<void> {
  echoStreamTests(factory, 'mplex')
  echoStreamTests(factory, 'yamux')
}
