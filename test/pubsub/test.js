'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-bytes'))
const expect = chai.expect

exports.pubsubTest = async (daemons) => {
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
}
