import type { PeerId } from '@libp2p/interface-peer-id'
import type { Daemon } from '../index.js'
import { HopMessage } from './pb/index.js'
import type { Duplex } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'
import { pipe } from 'it-pipe'
import { pbStream } from 'it-pb-stream'

const RELAY_V2_HOP = '/libp2p/circuit/relay/0.2.0/hop'

export const reserve = async (d: Daemon, peerID: PeerId, message?: Partial<HopMessage>): Promise<HopMessage> => {
  const stream = await d.client.openStream(peerID, RELAY_V2_HOP)
  const pb = pbStream(stream)
  pb.writePB({
    type: HopMessage.Type.RESERVE,
    ...(message ?? {})
  }, HopMessage)

  return await pb.readPB(HopMessage)
}

export const echoHandler = {
  protocol: '/echo/1.0.0',
  handler: async (stream: Duplex<Uint8ArrayList | Uint8Array, Uint8Array, Promise<void>>) => {
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
