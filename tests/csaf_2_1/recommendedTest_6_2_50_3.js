import { recommendedTest_6_2_50_3 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_50_3', function () {
  const range = (
    /** @type {string} */ name,
    /** @type {string} */ productId
  ) => ({
    category: 'product_version_range',
    name,
    product: { name, product_id: productId },
  })
  const version = (
    /** @type {string} */ name,
    /** @type {string} */ productId
  ) => ({
    category: 'product_version',
    name,
    product: { name, product_id: productId },
  })
  const vendor = (/** @type {unknown[]} */ branches) => ({
    product_tree: {
      branches: [{ category: 'vendor', name: 'Example Company', branches }],
    },
  })
  const status = {
    product_status: { known_affected: ['A'], known_not_affected: ['B'] },
  }

  it('skips documents not matching the input schema', async function () {
    const result = await recommendedTest_6_2_50_3({
      product_tree: { branches: 'invalid' },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('handles missing product trees and statuses', async function () {
    expect(
      (await recommendedTest_6_2_50_3({ vulnerabilities: [{}] })).warnings
    ).to.have.length(0)
    expect(
      (
        await recommendedTest_6_2_50_3({
          ...vendor([range('vers:intdot/>2.1.0|<4.2.0', 'A')]),
          vulnerabilities: [{}],
        })
      ).warnings
    ).to.have.length(0)
  })

  it('ignores same group, non-contradicting and unreferenced products', async function () {
    const tree = vendor([
      range('vers:intdot/>2.1.0|<4.2.0', 'A'),
      version('2.4.0', 'B'),
      version('2.5.0', 'C'),
    ])
    expect(
      (
        await recommendedTest_6_2_50_3({
          ...tree,
          vulnerabilities: [
            {
              product_status: {
                known_affected: ['A', 'B'],
                last_affected: ['C'],
              },
            },
          ],
        })
      ).warnings
    ).to.have.length(0)
    expect(
      (
        await recommendedTest_6_2_50_3({
          ...tree,
          vulnerabilities: [{ product_status: { known_affected: ['A'] } }],
        })
      ).warnings
    ).to.have.length(0)
  })

  it('ignores ranges that are neither vers nor vls', async function () {
    const result = await recommendedTest_6_2_50_3({
      ...vendor([range('not a range', 'A'), version('2.4.0', 'B')]),
      vulnerabilities: [status],
    })
    expect(result.warnings).to.have.length(0)
  })

  it('ignores product version ranges without a name', async function () {
    const result = await recommendedTest_6_2_50_3({
      ...vendor([
        {
          category: 'product_version_range',
          product: { name: 'A', product_id: 'A' },
        },
        version('2.4.0', 'B'),
      ]),
      vulnerabilities: [status],
    })
    expect(result.warnings).to.have.length(0)
  })

  it('ignores versions outside of the range', async function () {
    for (const v of ['5.0.0', '4.2.0', '2.1.0']) {
      const result = await recommendedTest_6_2_50_3({
        ...vendor([range('vers:intdot/>2.1.0|<4.2.0', 'A'), version(v, 'B')]),
        vulnerabilities: [status],
      })
      expect(result.warnings, v).to.have.length(0)
    }
  })

  it('handles versions with prerelease and build suffixes', async function () {
    for (const v of ['2.4.0-rc1', '2.4.0+build.1']) {
      const result = await recommendedTest_6_2_50_3({
        ...vendor([range('vers:semver/>2.1.0|<4.2.0', 'A'), version(v, 'B')]),
        vulnerabilities: [status],
      })
      expect(result.warnings, v).to.have.length(1)
    }
  })

  it('reports a pair only once', async function () {
    const result = await recommendedTest_6_2_50_3({
      ...vendor([
        range('vers:intdot/>2.1.0|<4.2.0', 'A'),
        version('2.4.0', 'B'),
        version('2.5.0', 'B'),
      ]),
      vulnerabilities: [status],
    })
    expect(result.warnings).to.have.length(1)
  })
})
