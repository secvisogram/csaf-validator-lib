import { recommendedTest_6_2_26 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_26', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_26({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).toBe(0)
  })
  it('skips empty objects', async function () {
    expect(
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
      ).warnings.length
    ).toBe(1)
  })
  it('skips CWEs without a usage property (version older than 4.11)', async function () {
    expect(
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
      ).warnings.length
    ).toBe(0)
  })
})
