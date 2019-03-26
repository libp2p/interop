'use strict'

const ma = require('multiaddr')

const connect = async (daemonR, daemon1, daemon2) => {
  const identifyR = await daemonR.client.identify()
  const identify2 = await daemon2.client.identify()

  await daemon1.client.connect(identifyR.peerId, identifyR.addrs) // should be websokets?
  await daemon2.client.connect(identifyR.peerId, identifyR.addrs)

  const circuitAddr = ma(getCircuitAddr(identify2.addrs))

  console.log('c_addr', identifyR.addrs, circuitAddr)

  await daemon1.client.connect(identify2.peerId, [circuitAddr])
  return circuitAddr
}

const getCircuitAddr = (addrs) => addrs
  .map((a) => a.toString())
  .find((a) => a.includes('/p2p-circuit'))

module.exports.connect = connect
module.exports.getCircuitAddr = getCircuitAddr
