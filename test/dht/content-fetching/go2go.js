/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const uint8ArrayFromString = require('uint8arrays/from-string')

const spawnDaemons = require('../../utils/spawnDaemons')

describe.skip('dht.contentFetching', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'go', { dht: true })

    // connect them
    const identify0 = await daemons[0].client.identify()

    await daemons[1].client.connect(identify0.peerId, identify0.addrs)

    // jsDaemon1 will take some time to get the peers
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go peer to go peer', async function () {
    this.timeout(10 * 1000)

    const key = uint8ArrayFromString('keyA')
    const value = uint8ArrayFromString('hello data')

    await daemons[0].client.dht.put(key, value)

    const data = await daemons[1].client.dht.get(key)

    expect(data).to.equalBytes(data)
  })
})
