import { recommendedTest_6_2_39_12 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_12.js'

describe('recommendedTest_6_2_39_12', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_39_12({}).warnings.length).to.equal(0)
  })

  it('only runs on relevant category', function () {
    const result = recommendedTest_6_2_39_12({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when vulnerabilities is missing', function () {
    const result = recommendedTest_6_2_39_12({
      document: { category: 'csaf_vulnerability_report' },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
