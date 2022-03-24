import path from 'path'
import { fileURLToPath } from 'url'
import type { NodeType, PeerIdType } from '../..'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) // eslint-disable-line @typescript-eslint/naming-convention

type KeyCollection = Record<PeerIdType, string>

const goKeys: KeyCollection = {
  ed25519: path.join(__dirname, 'go.ed25519.key'),
  rsa: path.join(__dirname, 'go.rsa.key'),
  secp256k1: path.join(__dirname, 'go.secp256k1.key')
}

const jsKeys: KeyCollection = {
  ed25519: path.join(__dirname, 'js.ed25519.key'),
  rsa: path.join(__dirname, 'js.rsa.key'),
  secp256k1: path.join(__dirname, 'js.secp256k1.key')
}

export const keys: Record<NodeType, KeyCollection> = {
  go: goKeys,
  js: jsKeys
}
