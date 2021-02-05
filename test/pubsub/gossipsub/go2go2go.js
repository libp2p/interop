/* eslint-env mocha */
'use strict'

const spawnDaemons = require('../../utils/spawnDaemons')
const { pubsubTest } = require('../test')

describe.only('pubsub - gossipsub', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(3, 'go', { pubsub: true })

    // connect them 
    const identify0 = await daemons[0].client.identify()
    await daemons[1].client.connect(identify0.peerId, identify0.addrs)

    const identify1 = await daemons[1].client.identify()
    await daemons[2].client.connect(identify1.peerId, identify1.addrs)
  })

  // Stop daemons
  after(async function () {
    await Promise.all(
      daemons.map((daemon) => daemon.stop())
    )
  })

  it('go publish to go subscriber with a hop', async function () {
    this.timeout(50 * 1000)

    await new Promise((resolve) => setTimeout(resolve, 20000))

    return pubsubTest([daemons[2], daemons[0]])
  })
})
