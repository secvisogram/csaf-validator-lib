import assert from 'node:assert'
import { optionalTest_6_2_37 } from '../../csaf_2_1/optionalTests.js'

describe('optionalTest_6_2_37', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      optionalTest_6_2_37({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })
})
