import { recommendedTest_6_2_56_4 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_56_4.js'

describe('recommendedTest_6_2_56_4', function () {
  it('skips documents without vulnerabilities', function () {
    expect(recommendedTest_6_2_56_4({ document: {} }).warnings.length).to.equal(
      0
    )
  })

  it('does not warn for an action without dl_vuln_ids', function () {
    const result = recommendedTest_6_2_56_4({
      document: { involvement: { actions: [{}] } },
      vulnerabilities: [{ dl_vuln_id: 'V1' }],
    })
    expect(result.warnings.length).to.equal(0)
  })
})
