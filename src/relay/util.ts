import { pipe } from 'it-pipe'
import { pbStream } from 'it-protobuf-stream'
import { HopMessage } from './pb/index.js'
import type { Daemon } from '../index.js'
import type { PeerId } from '@libp2p/interface'
import type { Duplex, Source } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'

const RELAY_V2_HOP = '/libp2p/circuit/relay/0.2.0/hop'

export const reserve = async (d: Daemon, peerID: PeerId, message?: Partial<HopMessage>): Promise<HopMessage> => {
  const stream = await d.client.openStream(peerID, RELAY_V2_HOP)
  const pb = pbStream(stream)
  await pb.write({
    type: HopMessage.Type.RESERVE,
    ...(message ?? {})
  }, HopMessage)

  return pb.read(HopMessage)
}

export const echoHandler = {
  protocol: '/echo/1.0.0',
  handler: async (stream: Duplex<AsyncIterable<Uint8ArrayList | Uint8Array>, Source<Uint8Array>, Promise<void>>) => {
    await pipe(
      stream,
      async function * (src) {
        for await (const buf of src) {
          yield buf.subarray()
        }
      },
      stream
    )
  }
}
