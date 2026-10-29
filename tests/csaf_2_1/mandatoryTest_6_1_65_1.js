import { mandatoryTest_6_1_65_1 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_65_1.js'

describe('mandatoryTest_6_1_65_1', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_65_1({ document: 'mydoc' }).isValid).to.equal(true)
    expect(
      mandatoryTest_6_1_65_1({ document: { involvement: { actions: [] } } })
        .isValid
    ).to.equal(true)
  })

  it('detects undefined dl_vuln_ids', function () {
    const result = mandatoryTest_6_1_65_1({
      document: {
        involvement: {
          actions: [{}, { dl_vuln_ids: ['VULN-1', 'VULN-2'] }],
        },
      },
      vulnerabilities: [{ dl_vuln_id: 'VULN-1' }, {}],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1/dl_vuln_ids/1'
    )
  })

  it('detects references without any vulnerabilities', function () {
    const result = mandatoryTest_6_1_65_1({
      document: {
        involvement: { actions: [{ dl_vuln_ids: ['VULN-1'] }] },
      },
    })
    expect(result.isValid).to.equal(false)
  })

  it('accepts defined dl_vuln_ids', function () {
    const result = mandatoryTest_6_1_65_1({
      document: {
        involvement: {
          actions: [{ dl_vuln_ids: ['VULN-1'] }, { dl_vuln_ids: ['VULN-1'] }],
        },
      },
      vulnerabilities: [{ dl_vuln_id: 'VULN-1' }],
    })
    expect(result.isValid).to.equal(true)
  })
})
