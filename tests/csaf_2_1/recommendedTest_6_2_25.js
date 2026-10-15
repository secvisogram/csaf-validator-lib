import { recommendedTest_6_2_25 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_25', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_25({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).to.equal(0)
  })
  it('skips empty objects', async function () {
    expect(
      (
        await recommendedTest_6_2_25({
          vulnerabilities: [
            {
              cwes: [
                {
                  id: 'CWE-20',
                  name: 'Improper Input Validation',
                  version: '4.13',
                },
              ],
            },
            {}, // should be ignored
          ],
        })
      ).warnings.length
    ).to.equal(1)
  })
})
