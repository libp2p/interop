/* eslint-env mocha */
'use strict'

const connectTest = require('../test')
const spawnDaemons = require('../../utils/spawnDaemons')

module.exports = (name, config) => {
  describe(`connect (secp256k1) using ${name}`, () => {
    let daemons

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await spawnDaemons(2, [
        { type: 'go', keyType: 'secp256k1' },
        { type: 'js', keyType: 'secp256k1' }
      ], config)
    })

    // Stop daemons
    after(async function () {
      await Promise.all(
        daemons.map((daemon) => daemon.stop())
      )
    })

    it('go peer to js peer', function () {
      this.timeout(10 * 1000)

      const ids = ['16Uiu2HAmPu9PZESp4keskcfDkdBvDhs1Dra1aLjfeHRCFHgQoD6L', '16Uiu2HAm7txvwZbeK5g3oB3DrRhnARTEjTNorVreWJomfHJHbEu2']
      return connectTest(daemons, ids)
    })
  })
}
