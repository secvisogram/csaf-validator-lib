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
  it('skips CWEs without a usage property (version older than 4.11)', async function () {
    assert.equal(
      (
        await recommendedTest_6_2_26({
          vulnerabilities: [
            {
              cwes: [
                {
                  id: 'CWE-1004',
                  name: "Sensitive Cookie Without 'HttpOnly' Flag",
                  version: '4.11',
                },
              ],
            },
          ],
        })
      ).warnings.length,
      0
    )
  })
})
