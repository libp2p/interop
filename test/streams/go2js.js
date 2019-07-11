/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect
const os = require('os')
const path = require('path')
const { decode } = require('length-prefixed-stream')
const ma = require('multiaddr')
const { StreamInfo } = require('libp2p-daemon/src/protocol')
const { ends, isWindows } = require('libp2p-daemon/src/util')
const tmp = require('tmp')

const spawnDaemons = require('../utils/spawnDaemons')

describe('streams', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, ['go', 'js'])

    // connect them
    const identify0 = await daemons[0].client.identify()
    await daemons[1].client.connect(identify0.peerId, identify0.addrs)
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go stream to js listener', async function () {
    this.timeout(10 * 1000)

    const addr = isWindows
      ? ma('/ip4/0.0.0.0/tcp/9090')
      : ma(`/unix${tmp.tmpNameSync()}`)

    const sendingIdentity = await daemons[0].client.identify()
    const receivingIdentity = await daemons[1].client.identify()
    const hello = Buffer.from('hello, peer')

    await daemons[1].client.startServer(addr, async (conn) => {
      // Decode the stream
      const dec = decode()
      conn.pipe(dec)

      // Read the stream info from the daemon
      const message = await ends(dec).first()
      let response = StreamInfo.decode(message)

      expect(response.peer).to.eql(sendingIdentity.peerId.toBytes())
      expect(response.proto).to.eql('/echo/1.0.0')
      expect(message).to.eql(hello)
      conn.unpipe(dec)
    })
    await daemons[1].client.registerStreamHandler(addr, '/echo/1.0.0')

    // Open a connection between the peer and our daemon
    // Then send hello from the peer to the daemon
    const connection = await daemons[0].client.openStream(receivingIdentity.peerId, '/echo/1.0.0')
    connection.write(hello)
    connection.end()
  })
})
