import { mandatoryTest_6_1_27_6 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_6.js'

describe('mandatoryTest_6_1_27_6', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_27_6({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('returns valid for documents with irrelevant category', function () {
    expect(
      mandatoryTest_6_1_27_6({
        document: { category: 'csaf_base' },
        vulnerabilities: [{}],
      }).isValid
    ).to.equal(true)
  })

  it('returns invalid when vulnerability has no product_status', function () {
    const result = mandatoryTest_6_1_27_6({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
  })

  it('returns valid when vulnerability has an empty product_status ', function () {
    const result = mandatoryTest_6_1_27_6({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{ product_status: {} }],
    })
    expect(result.isValid).to.equal(true)
  })

  it('returns valid when vulnerability has an not empty product_status ', function () {
    const result = mandatoryTest_6_1_27_6({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [
        {
          product_status: {
            first_affected: [],
          },
        },
      ],
    })
    expect(result.isValid).to.equal(true)
  })
})
