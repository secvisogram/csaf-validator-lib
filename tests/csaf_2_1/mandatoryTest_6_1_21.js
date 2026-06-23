import assert from 'node:assert/strict'

import { mandatoryTest_6_1_21 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_21', function () {
  it('passes a reverse-ordered but complete revision history (2, 1)', function () {
    // also matches the scenario from oasis_csaf_tc-csaf_2_1-2024-6-1-14-12.json
    // which has same-date entries sorted by version number
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [
            {
              date: '2024-01-22T10:00:00.000Z',
              number: '2',
              summary: 'Second version.',
            },
            {
              date: '2024-01-22T10:00:00.000Z',
              number: '1',
              summary: 'Initial version.',
            },
          ],
        },
      },
    })
    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
  })
})
