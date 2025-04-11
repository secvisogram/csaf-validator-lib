import assert from 'node:assert'
import { mandatoryTest_6_1_9 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_9', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_9({ document: 'mydoc' }).isValid, true)
  })
})
