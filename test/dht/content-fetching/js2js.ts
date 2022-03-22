/* eslint-env mocha */
'use strict'

const { expect } = require('aegir/utils/chai')
const spawnDaemons = require('../../utils/spawnDaemons')
const record = require('../../utils/dht-record')

describe('dht.contentFetching', () => {
  let daemons

  // Start Daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, ['js', 'js'], { dht: true })

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

  it('js peer to go peer', async function () {
    this.timeout(10 * 1000)

    await daemons[0].client.dht.put(record.key, record.value)

    const data = await daemons[1].client.dht.get(record.key)
    expect(data).to.equalBytes(record.value)
  })
})
