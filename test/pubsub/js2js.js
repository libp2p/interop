/* eslint-env mocha */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const spawnDaemons = require('../utils/spawnDaemons')

describe('pubsub', () => {
  let daemons

  // Start daemons
  before(async function () {
    this.timeout(20 * 1000)

    daemons = await spawnDaemons(2, 'js', { pubsub: true })

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

  it('js publish to js subscriber', async function () {
    this.timeout(10 * 1000)

    const topic = 'test-topic'
    const data = Buffer.from('test-data')

    const subscribeIterator = await daemons[1].client.pubsub.subscribe(topic)
    const subscriber = async () => {
      for await (const message of subscribeIterator) {
        expect(message).to.exist()
        expect(message.data).to.exist()
        expect(message.data).to.equalBytes(data)
        return
      }
    }

    const publisher = async () => {
      // wait for subscription stream
      await new Promise(resolve => setTimeout(resolve, 200))
      daemons[0].client.pubsub.publish(topic, data)
    }

    return Promise.all([
      subscriber(),
      publisher()
    ])
  })
})
