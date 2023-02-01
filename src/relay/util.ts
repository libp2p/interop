import type { PeerId } from '@libp2p/interface-peer-id'
import type { Daemon } from '../index.js'
import { handshake } from 'it-handshake'
import * as lp from 'it-length-prefixed'
import { HopMessage } from './pb/index.js'

const RELAY_V2_HOP = '/libp2p/circuit/relay/0.2.0/hop'

export const reserve = async (d: Daemon, peerID: PeerId): Promise<HopMessage> => {
  const stream = await d.client.openStream(peerID, RELAY_V2_HOP)
  const shake = handshake(stream)
  const decoder = lp.decode.fromReader(shake.reader)
  // reserve message
  shake.write(lp.encode.single(HopMessage.encode({ type: HopMessage.Type.RESERVE })).subarray())
  // @ts-expect-error
  const raw = await decoder.next()
  if (raw.value !== undefined) {
    throw new Error('could not read hop response')
  }
  return HopMessage.decode(raw.value)
}
