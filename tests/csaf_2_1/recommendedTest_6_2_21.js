import assert from 'node:assert'
import { recommendedTest_6_2_21 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_21', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_21({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })
  it('skips empty objects', function () {
    assert.equal(
      recommendedTest_6_2_21({
        document: {
          tracking: {
            revision_history: [
              {
                date: '2024-01-22T10:00:00.000Z',
                number: '1',
                summary: 'Initial version.',
              },
              {
                date: '2024-01-22T10:00:00.000Z',
                number: '2',
                summary: 'Second version.',
              },
              {}, // should be ignored
            ],
          },
        },
      }).warnings.length,
      1
    )
  })
})
