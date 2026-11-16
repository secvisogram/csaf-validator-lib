import { recommendedTest_6_2_57 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_57.js'

describe('recommendedTest_6_2_57', function () {
  it('skips documents without vulnerabilities', function () {
    expect(recommendedTest_6_2_57({}).warnings.length).to.equal(0)
  })

  it('warns for an unreferenced dl_vuln_id without involvement', function () {
    const result = recommendedTest_6_2_57({
      document: {},
      vulnerabilities: [{ dl_vuln_id: 'VULN-1' }],
    })
    expect(result.warnings).to.have.length(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/0/dl_vuln_id'
    )
  })
})
