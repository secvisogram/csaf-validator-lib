import assert from 'node:assert/strict'
import { informativeTest_6_3_6 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_6', function () {
  it('returns no infos for invalid input', async function () {
    const result = await informativeTest_6_3_6('not-an-object')
    assert.equal(result.infos.length, 0)
  })
})
