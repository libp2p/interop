/* eslint-env mocha */
'use strict'

const spawnDaemons = require('../../utils/spawnDaemons')
const { pubsubTest } = require('../test')

describe('pubsub - floodsub', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'js', { pubsub: true, pubsubRouter: 'floodsub' })

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

  it('js publish to js subscriber', function () {
    this.timeout(30 * 1000)

    return pubsubTest(daemons)
  })
})
