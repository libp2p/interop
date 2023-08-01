import { expect } from 'aegir/chai'
import { keys } from './resources/keys/index.js'
import type { Daemon, NodeType, SpawnOptions, DaemonFactory, PeerIdType } from './index.js'

export function connectTests (factory: DaemonFactory): void {
  const keyTypes: PeerIdType[] = ['ed25519', 'rsa', 'secp256k1']
  const impls: NodeType[] = ['js', 'go']

  for (const keyType of keyTypes) {
    for (const implA of impls) {
      for (const implB of impls) {
        runConnectTests(
          `noise/${keyType}`,
          factory,
          { type: implA, noise: true, key: keys.go[keyType] },
          { type: implB, noise: true, key: keys.js[keyType] }
        )
      }
    }
  }
}

function runConnectTests (name: string, factory: DaemonFactory, optionsA: SpawnOptions, optionsB: SpawnOptions): void {
  describe(`connect using ${name}`, () => {
    let daemonA: Daemon
    let daemonB: Daemon

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemonA = await factory.spawn(optionsA)
      daemonB = await factory.spawn(optionsB)
    })

    // Stop daemons
    after(async function () {
      await Promise.all(
        [daemonA, daemonB]
          .filter(Boolean)
          .map(async d => { await d.stop() })
      )
    })

    it(`${optionsA.type} peer to ${optionsB.type} peer`, async function () {
      this.timeout(10 * 1000)

      const identify1 = await daemonA.client.identify()
      const identify2 = await daemonB.client.identify()

      // verify connected peers
      const knownPeersBeforeConnect1 = await daemonA.client.listPeers()
      expect(knownPeersBeforeConnect1).to.have.lengthOf(0)

      const knownPeersBeforeConnect2 = await daemonB.client.listPeers()
      expect(knownPeersBeforeConnect2).to.have.lengthOf(0)

      // connect peers
      await daemonA.client.connect(identify2.peerId, identify2.addrs)

      // daemonA will take some time to get the peers
      await new Promise(resolve => setTimeout(resolve, 1000))

      // verify connected peers
      const knownPeersAfterConnect1 = await daemonA.client.listPeers()
      expect(knownPeersAfterConnect1).to.have.length.greaterThanOrEqual(1)
      expect(knownPeersAfterConnect1[0].toString()).to.equal(identify2.peerId.toString())

      const knownPeersAfterConnect2 = await daemonB.client.listPeers()
      expect(knownPeersAfterConnect2).to.have.length.greaterThanOrEqual(1)
      expect(knownPeersAfterConnect2[0].toString()).to.equal(identify1.peerId.toString())
    })
  })
}
