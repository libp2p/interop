/* eslint-env mocha */

import { expect } from 'aegir/chai'
import type { Daemon, DaemonFactory, Muxer, NodeType, SpawnOptions } from '../index.js'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { pipe } from 'it-pipe'
import all from 'it-all'
import defer from 'p-defer'

export function echoStreamTests (factory: DaemonFactory, muxer: Muxer): void {
  const nodeTypes: NodeType[] = ['js', 'go']

  for (const typeA of nodeTypes) {
    for (const typeB of nodeTypes) {
      runEchoStreamTests(
        factory,
        muxer,
        { type: typeA, muxer },
        { type: typeB, muxer }
      )
    }
  }
}

function runEchoStreamTests (factory: DaemonFactory, muxer: Muxer, optionsA: SpawnOptions, optionsB: SpawnOptions): void {
  describe(`echo streams - ${muxer}`, () => {
    let daemons: Daemon[]

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await Promise.all([
        factory.spawn(optionsA),
        factory.spawn(optionsB)
      ])

      // connect them
      const identify0 = await daemons[0].client.identify()

      await daemons[1].client.connect(identify0.peerId, identify0.addrs)

      // jsDaemon1 will take some time to get the peers
      await new Promise(resolve => setTimeout(resolve, 1000))
    })

    // Stop daemons
    after(async function () {
      if (daemons != null) {
        await Promise.all(
          daemons.map(async (daemon) => { await daemon.stop() })
        )
      }
    })

    it(`${optionsA.type} sender to ${optionsB.type} listener`, async function () {
      this.timeout(10 * 1000)

      const receivingIdentity = await daemons[1].client.identify()
      const protocol = '/echo/1.0.0'
      const input = [uint8ArrayFromString('hello world')]

      await daemons[1].client.registerStreamHandler(protocol, async (stream) => {
        await pipe(
          stream,
          async function * (source) {
            for await (const buf of source) {
              yield buf.subarray()
            }
          },
          stream
        )
      })

      const stream = await daemons[0].client.openStream(receivingIdentity.peerId, protocol)

      // without this the socket can close before we receive a response
      const responseReceived = defer()

      const output = await pipe(
        input,
        async function * (source) {
          yield * source
          await responseReceived.promise
        },
        stream,
        async function * (source) {
          for await (const buf of source) {
            yield buf.subarray()
            responseReceived.resolve()
          }
        },
        async (source) => await all(source)
      )

      expect(output).to.deep.equal(input)
    })
  })
}
