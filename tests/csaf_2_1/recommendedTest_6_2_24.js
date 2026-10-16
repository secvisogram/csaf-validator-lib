import { recommendedTest_6_2_24 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_24', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_24({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).toBe(0)
  })

  it('skips cwe entries with an unknown version (not in cwecMap)', async function () {
    expect(
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
                  version: '99.99',
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('skips empty objects', async function () {
    expect(
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
      ).warnings.length
    ).toBe(1)
  })

  it('skips cwe entries not matching the cwe schema but checks valid ones', async function () {
    const result = await recommendedTest_6_2_24({
      document: {
        tracking: { current_release_date: '2024-01-21T10:00:00.000Z' },
      },
      vulnerabilities: [
        {
          cwes: [
            { id: 'CWE-256', name: 'Plaintext Storage of a Password' }, // version missing
            {
              id: 'CWE-256',
              name: 'Plaintext Storage of a Password',
              version: 4.12,
            }, // wrong type
            'CWE-256', // not an object
            {
              id: 'CWE-256',
              name: 'Plaintext Storage of a Password',
              version: '4.12',
            },
          ],
        },
      ],
    })

    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/0/cwes/3/version'
    )
  })
})
