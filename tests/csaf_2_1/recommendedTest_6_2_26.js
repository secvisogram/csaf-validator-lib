import assert from 'node:assert'
import { recommendedTest_6_2_26 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_26', function () {
  it('only runs on relevant documents', async function () {
    assert.equal(
      (await recommendedTest_6_2_26({ vulnerabilities: 'mydoc' })).warnings
        .length,
      0
    )
  })
  it('skips empty objects', async function () {
    assert.equal(
      (
        await recommendedTest_6_2_26({
          vulnerabilities: [
            {
              cwes: [
                {
                  id: 'CWE-1023',
                  name: 'Incomplete Comparison with Missing Factors',
                  version: '4.13',
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
