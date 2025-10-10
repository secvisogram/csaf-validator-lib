import assert from 'node:assert/strict'
import { mandatoryTest_6_1_56 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_56.js'

describe('mandatoryTest_6_1_56', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_56({ document: 'mydoc' }).isValid, true)
  })
})
