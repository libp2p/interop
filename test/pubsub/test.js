'use strict'

const { expect } = require('aegir/utils/chai')
const first = require('it-first')
const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')

exports.pubsubTest = async (daemons) => {
  const topic = 'test-topic'
  const data = uint8ArrayFromString('test-data')

  const subscribeIterator = await daemons[1].client.pubsub.subscribe(topic)
  const subscriber = async () => {
    const message = await first(subscribeIterator)

    expect(message).to.exist()
    expect(message).to.have.property('data').that.equalBytes(data)
  }

  const publisher = async () => {
    // wait for subscription stream
    await new Promise(resolve => setTimeout(resolve, 800))
    daemons[0].client.pubsub.publish(topic, data)
  }

  return Promise.all([
    subscriber(),
    publisher()
  ])
}
