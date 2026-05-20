import assert from 'node:assert/strict'
import { mandatoryTest_6_1_26 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_26.js'

describe('mandatoryTest_6_1_26', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_26({ document: 'mydoc' }).isValid, true)
  })
  it('check use of reserved prefix csaf_ except if the value is csaf_base', function () {
    assert.equal(
      mandatoryTest_6_1_26({
        document: {
          category: 'csaf_invalid',
        },
      }).isValid,
      false
    )
  })
})
