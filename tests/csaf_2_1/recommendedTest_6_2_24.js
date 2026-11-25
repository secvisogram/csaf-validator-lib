import { recommendedTest_6_2_24 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_24', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_24({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).to.equal(0)
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
    ).to.equal(0)
  })

  it('ignores vulnerabilities without cwes', async function () {
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
    ).to.equal(1)
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

  it('does not cache a failed load of the cwe catalogues', async function () {
    const { cwecMap } = await import('../../lib/cwec.js')
    const original = cwecMap.get('4.13')
    // the query string yields a fresh module instance with an empty cache
    const fresh = await import(
      // @ts-expect-error query string is not resolvable by tsc
      '../../csaf_2_1/recommendedTests/recommendedTest_6_2_24.js?fresh'
    )
    const doc = {
      document: {
        tracking: { current_release_date: '2024-01-21T10:00:00.000Z' },
      },
      vulnerabilities: [{ cwes: [] }],
    }

    cwecMap.set('4.13', () => Promise.reject(new Error('offline')))
    let error = new Error('did not reject')
    try {
      await fresh
        .recommendedTest_6_2_24(doc)
        .catch((/** @type {Error} */ e) => (error = e))
    } finally {
      cwecMap.set('4.13', /** @type {any} */ (original))
    }
    expect(error.message).to.equal('offline')

    // the retry must succeed once the catalogue is available again
    const retried = await fresh.recommendedTest_6_2_24({
      document: {
        tracking: { current_release_date: '2024-01-21T10:00:00.000Z' },
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
      ],
    })
    expect(retried.warnings.length).to.equal(1)
  }, 60000)

  it('treats the catalogue release as the start of its day (boundary)', async function () {
    const run = (/** @type {string} */ date) =>
      recommendedTest_6_2_24({
        document: { tracking: { current_release_date: date } },
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
        ],
      })

    // 4.13 was released 2023-10-26
    expect((await run('2023-10-26T00:00:00Z')).warnings.length).to.equal(1)
    expect((await run('2023-10-25T23:59:59Z')).warnings.length).to.equal(0)
  })

  it('reports the path of a cwe in a later vulnerability', async function () {
    const result = await recommendedTest_6_2_24({
      document: {
        tracking: { current_release_date: '2024-01-21T10:00:00.000Z' },
      },
      vulnerabilities: [
        {},
        {
          cwes: [
            {
              id: 'CWE-256',
              name: 'Plaintext Storage of a Password',
              version: '4.12',
            },
          ],
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/1/cwes/0/version'
    )
  })

  it('reports only one warning per cwe even with many newer versions', async function () {
    const result = await recommendedTest_6_2_24({
      document: {
        tracking: { current_release_date: '2024-01-21T10:00:00.000Z' },
      },
      vulnerabilities: [
        {
          cwes: [
            {
              id: 'CWE-256',
              name: 'Plaintext Storage of a Password',
              version: '1.8.1',
            },
          ],
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
  })
})
