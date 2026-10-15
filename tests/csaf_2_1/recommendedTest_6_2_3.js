import { recommendedTest_6_2_3 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_3', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_3({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })
})
