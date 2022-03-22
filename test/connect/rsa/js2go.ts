/* eslint-env mocha */
'use strict'

import connectTest from '../test.js'
import spawnDaemons from '../../utils/spawn-daemons.js'

module.exports = (name, config) => {
  describe(`connect (RSA) using ${name}`, () => {
    let daemons

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await spawnDaemons(2, [
        { type: 'js', keyType: 'rsa' },
        { type: 'go', keyType: 'rsa' }
      ], config)
    })

    // Stop daemons
    after(async function () {
      await Promise.all(
        daemons.map((daemon) => daemon.stop())
      )
    })

    it('js peer to go peer', function () {
      this.timeout(10 * 1000)

      const ids = ['QmPFdSzvgd1HbZSd6oX2N2vCSnhSEeocbQZsMB42UG8smE', 'QmWS3xmxj1i659VUoustPU8KGzXkziqzF7BBGXS9fDwyz1']
      return connectTest(daemons, ids)
    })
  })
}
