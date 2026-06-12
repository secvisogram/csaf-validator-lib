import assert from 'node:assert/strict'
import { mandatoryTest_6_1_27_3 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_3.js'

describe('mandatoryTest_6_1_27_3', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_27_3({ document: 'mydoc' }).isValid, true)
  })

  it('returns valid for documents with irrelevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_3({
        document: { category: 'csaf_base' },
        vulnerabilities: [{}],
      }).isValid,
      true
    )
  })

  it('returns invalid for documents with relevant category', function () {
    assert.equal(
      mandatoryTest_6_1_27_3({
        document: { category: 'csaf_superseded' },
        vulnerabilities: [{}],
      }).isValid,
      false
    )
  })
})
