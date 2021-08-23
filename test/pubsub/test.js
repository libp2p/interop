'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')

exports.pubsubTest = async (daemons) => {
  const topic = 'test-topic'
  const data = uint8ArrayFromString('test-data')

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
    await new Promise(resolve => setTimeout(resolve, 800))
    daemons[0].client.pubsub.publish(topic, data)
  }

  return Promise.all([
    subscriber(),
    publisher()
  ])
}
