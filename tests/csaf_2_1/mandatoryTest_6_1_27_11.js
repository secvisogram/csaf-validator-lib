import assert from 'node:assert/strict'
import { mandatoryTest_6_1_27_11 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_11.js'

describe('mandatoryTest_6_1_27_11', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_27_11({ document: 'mydoc' }).isValid, true)
  })

  it('returns invalid for documents without vulnerabilities with relevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_11({
        document: { category: 'csaf_deprecated_security_advisory' },
        product_tree: [{}],
      }).isValid,
      false
    )
  })

  it('returns valid for documents with vulnerabilities with relevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_11({
        document: { category: 'csaf_deprecated_security_advisory' },
        vulnerabilities: [{}],
      }).isValid,
      true
    )
  })
})
