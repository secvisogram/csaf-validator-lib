import assert from 'node:assert'
import { mandatoryTest_6_1_1 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_1.js'

describe('mandatoryTest_6_1_1', function () {
  it('', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        notes: [
          {
            category: 'general',
            text: 'note',
            product_ids: ['CSAFPID-UNDEFINED'],
          },
        ],
      }).errors.length,
      1
    )
  })
})
