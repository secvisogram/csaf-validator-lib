import assert from 'node:assert/strict'

import { mandatoryTest_6_1_14 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_14.js'

describe('mandatoryTest_6_1_14', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_14({ product_tree: 'mydoc' }).isValid, true)
  })

  it('skips documents with invalid revision_history entries', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [
            { date: '2020-01-01T00:00:00+00:00', number: '1.0.0' },
            { date: '2020-01-01T00:00:00+00:00', number: 'invalid' },
          ],
        },
      },
    }

    assert.doesNotThrow(() => mandatoryTest_6_1_14(doc))
    const result = mandatoryTest_6_1_14(doc)
    assert.equal(result.isValid, true)
    assert.deepEqual(result.errors, [])
  })
})
