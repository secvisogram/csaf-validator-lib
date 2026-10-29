import { mandatoryTest_6_1_65_2 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_65_2.js'

describe('mandatoryTest_6_1_65_2', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_65_2({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('detects duplicate dl_vuln_ids', function () {
    const result = mandatoryTest_6_1_65_2({
      vulnerabilities: [{ dl_vuln_id: 'VULN-1' }, {}, { dl_vuln_id: 'VULN-1' }],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
    expect(result.errors[0].instancePath).to.equal(
      '/vulnerabilities/2/dl_vuln_id'
    )
  })

  it('accepts unique dl_vuln_ids', function () {
    expect(
      mandatoryTest_6_1_65_2({
        vulnerabilities: [{ dl_vuln_id: 'VULN-1' }, { dl_vuln_id: 'VULN-2' }],
      }).isValid
    ).to.equal(true)
  })
})
