import assert from 'node:assert/strict'
import { mandatoryTest_6_1_27_6 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_6.js'

describe('mandatoryTest_6_1_27_6', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_27_6({ document: 'mydoc' }).isValid, true)
  })

  it('returns valid for documents with irrelevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_6({
        document: { category: 'csaf_base' },
        vulnerabilities: [{}],
      }).isValid,
      true
    )
  })

  it('returns invalid when vulnerability has no product_status', function () {
    const result = mandatoryTest_6_1_27_6({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
  })

  it('returns valid when vulnerability has an empty product_status ', function () {
    const result = mandatoryTest_6_1_27_6({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{ product_status: {} }],
    })
    assert.equal(result.isValid, true)
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
    assert.equal(result.isValid, true)
  })
})
