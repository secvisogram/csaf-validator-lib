import assert from 'node:assert'
import { recommendedTest_6_2_33 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_33', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_33({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })
  it('skips empty objects', function () {
    assert.equal(
      recommendedTest_6_2_33({
        document: {
          tracking: {
            revision_history: [
              {
                date: '2024-01-22T10:00:00.000Z',
                number: '1',
                summary: 'Initial version.',
              },
              {}, // should be ignored
            ],
          },
        },
        vulnerabilities: [
          {
            disclosure_date: '2024-02-24T10:00:00.000Z',
          },
          {}, // should be ignored
        ],
      }).warnings.length,
      1
    )
  })
})
