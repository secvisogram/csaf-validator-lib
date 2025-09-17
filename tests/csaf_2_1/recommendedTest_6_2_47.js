import assert from 'node:assert'
import { recommendedTest_6_2_47 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_47', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_47({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })
})
