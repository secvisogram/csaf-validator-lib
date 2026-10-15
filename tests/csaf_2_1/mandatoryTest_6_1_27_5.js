import { mandatoryTest_6_1_27_5 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_5.js'

describe('mandatoryTest_6_1_27_5', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_27_5({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('returns valid for documents with irrelevant category', function () {
    expect(
      mandatoryTest_6_1_27_5({
        document: { category: 'csaf_base' },
        vulnerabilities: [{}],
      }).isValid
    ).to.equal(true)
  })

  it('returns invalid when vulnerability has no notes', function () {
    const result = mandatoryTest_6_1_27_5({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
  })

  it('returns invalid when vulnerability has empty notes array', function () {
    const result = mandatoryTest_6_1_27_5({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{ notes: [] }],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
  })
})
