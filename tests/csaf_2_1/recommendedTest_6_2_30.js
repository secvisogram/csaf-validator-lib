import { recommendedTest_6_2_30 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_30', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_30({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })
})
