import assert from 'node:assert/strict'
import { mandatoryTest_6_1_27_4 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_4.js'

describe('mandatoryTest_6_1_27_4', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_27_4({ document: 'mydoc' }).isValid, true)
  })

  it('returns invalid for documents without product_tree with relevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_4({
        document: { category: 'csaf_deprecated_security_advisory' },
        vulnerabilities: [{}],
      }).isValid,
      false
    )
  })

  it('returns valid for documents with empty product_tree with relevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_4({
        document: { category: 'csaf_deprecated_security_advisory' },
        product_tree: {},
      }).isValid,
      true
    )
  })
})
