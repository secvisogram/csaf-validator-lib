import assert from 'node:assert'
import { recommendedTest_6_2_24 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_24', function () {
  it('only runs on relevant documents', async function () {
    assert.equal(
      (await recommendedTest_6_2_24({ vulnerabilities: 'mydoc' })).warnings
        .length,
      0
    )
  })
  it('skips empty objects', async function () {
    assert.equal(
      (
        await recommendedTest_6_2_24({
          document: {
            tracking: {
              current_release_date: '2024-01-21T10:00:00.000Z',
            },
          },
          vulnerabilities: [
            {
              cwes: [
                {
                  id: 'CWE-256',
                  name: 'Plaintext Storage of a Password',
                  version: '4.12',
                },
              ],
            },
            {}, // should be ignored
          ],
        })
      ).warnings.length,
      1
    )
  })
})
