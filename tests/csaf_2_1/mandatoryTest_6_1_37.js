import assert from 'node:assert/strict'
import { mandatoryTest_6_1_37 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_37.js'

describe('mandatoryTest_6_1_37', function () {
  it('only runs on relevant documents', async function () {
    assert.equal(
      (await mandatoryTest_6_1_37({ document: 'mydoc' })).isValid,
      true
    )
  })
})
