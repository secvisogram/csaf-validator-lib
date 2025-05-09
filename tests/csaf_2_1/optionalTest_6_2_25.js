import assert from 'node:assert'
import { optionalTest_6_2_25 } from '../../csaf_2_1/optionalTests.js'

describe('optionalTest_6_2_25', function () {
  it('only runs on relevant documents', async function () {
    assert.equal(
      (await optionalTest_6_2_25({ vulnerabilities: 'mydoc' })).warnings.length,
      0
    )
  })
})
