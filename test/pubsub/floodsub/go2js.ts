/* eslint-env mocha */
'use strict'

import spawnDaemons from '../../utils/spawn-daemons.js'
const { pubsubTest } = require('../test')

describe('pubsub - floodsub', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, ['go', 'js'], { pubsub: true, pubsubRouter: 'floodsub' })

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

  it('go publish to js subscriber', function () {
    this.timeout(20 * 1000)

    return pubsubTest(daemons)
  })
})
