/* eslint-env mocha */

import connectTest from '../test.js'
import spawnDaemons from '../../utils/spawn-daemons.js'

module.exports = (name, config) => {
  describe(`connect (ed25519) using ${name}`, () => {
    let daemons

    // Start Daemons
    before(async function () {
      this.timeout(20 * 1000)

      daemons = await spawnDaemons(2, [
        { type: 'go', keyType: 'ed25519' },
        { type: 'js', keyType: 'ed25519' }
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

      const ids = ['12D3KooWRqGdmFVwspgLBajUQacY1TrkBkAUqmjqjbHSFGEoZs9R', '12D3KooWDaHkRyb4Nkf8L6WHbsWB9Krt491NDk8PaPGogXvj2pcY']
      return connectTest(daemons, ids)
    })
  })
}
