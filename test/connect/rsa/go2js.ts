/* eslint-env mocha */
'use strict'

const connectTest = require('../test')
const spawnDaemons = require('../../utils/spawnDaemons')

module.exports = (name, config) => {
  describe(`connect (RSA) using ${name}`, () => {
    let daemons

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await spawnDaemons(2, [
        { type: 'go', keyType: 'rsa' },
        { type: 'js', keyType: 'rsa' }
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

      const ids = ['QmWS3xmxj1i659VUoustPU8KGzXkziqzF7BBGXS9fDwyz1', 'QmPFdSzvgd1HbZSd6oX2N2vCSnhSEeocbQZsMB42UG8smE']
      return connectTest(daemons, ids)
    })
  })
}
