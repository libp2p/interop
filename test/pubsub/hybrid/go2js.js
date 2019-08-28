/* eslint-env mocha */
'use strict'

const spawnDaemons = require('../../utils/spawnDaemons')
const { pubsubTest } = require('../test')

describe('pubsub - hybrid', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    const daemonOptions = [
      { pubsub: true, pubsubRouter: 'floodsub' },
      { pubsub: true, pubsubRouter: 'gossipsub' }
    ]

    daemons = await spawnDaemons(2, ['go', 'js'], daemonOptions)

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

  it('go floodsub publish to js gossipsub subscriber', function () {
    this.timeout(20 * 1000)

    return pubsubTest(daemons)
  })
})
