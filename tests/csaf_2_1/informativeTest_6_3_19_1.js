import isBrowserRuntime from '../shared/isBrowserRuntime.js'
import { informativeTest_6_3_19_1 } from '../../csaf_2_1/informativeTests.js'

const leaf = (/** @type {string} */ name, /** @type {string} */ productId) => ({
  category: 'product_version_range',
  name,
  product: { name, product_id: productId },
})

const vendor = (/** @type {unknown[]} */ branches) => ({
  product_tree: {
    branches: [{ category: 'vendor', name: 'Example Company', branches }],
  },
})

describe.skipIf(isBrowserRuntime)('informativeTest_6_3_19_1', function () {
  it('skips documents not matching the input schema', async function () {
    const result = await informativeTest_6_3_19_1({
      product_tree: { branches: 'invalid' },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('skips documents without product version ranges, vulnerabilities or product status', async function () {
    expect(
      (
        await informativeTest_6_3_19_1({
          product_tree: { branches: [{ category: 'vendor', name: 'X' }] },
          vulnerabilities: [{ product_status: { known_affected: ['NOPE'] } }],
        })
      ).infos
    ).to.have.length(0)
    expect(
      (await informativeTest_6_3_19_1({ vulnerabilities: [{}] })).infos
    ).to.have.length(0)
    expect(
      (
        await informativeTest_6_3_19_1(
          vendor([leaf('vers:semver/>1.0.0|<5.0.0', 'A')])
        )
      ).infos
    ).to.have.length(0)
  })

  it('does not report overlapping ranges in different groups or unknown product ids', async function () {
    const result = await informativeTest_6_3_19_1({
      ...vendor([
        leaf('vers:semver/>1.0.0|<5.0.0', 'A'),
        leaf('vers:semver/>3.0.0|<7.0.0', 'B'),
      ]),
      vulnerabilities: [
        { product_status: { known_affected: ['A', 'UNKNOWN'], fixed: ['B'] } },
      ],
    })
    expect(result.infos).to.have.length(0)
  })

  it('reports each overlapping pair only once', async function () {
    const result = await informativeTest_6_3_19_1({
      ...vendor([
        leaf('vers:semver/>1.0.0|<5.0.0', 'A'),
        leaf('vers:semver/>3.0.0|<7.0.0', 'B'),
      ]),
      vulnerabilities: [
        { product_status: { known_affected: ['A', 'B'], fixed: ['A', 'B'] } },
      ],
    })
    expect(result.infos).to.have.length(1)
  })

  it('reports the vulnerability of each overlap separately', async function () {
    const status = { known_affected: ['A', 'B'] }
    const result = await informativeTest_6_3_19_1({
      ...vendor([
        leaf('vers:semver/>1.0.0|<5.0.0', 'A'),
        leaf('vers:semver/>3.0.0|<7.0.0', 'B'),
      ]),
      vulnerabilities: [
        {},
        { product_status: status },
        { product_status: status },
      ],
    })
    expect(result.infos.map((i) => i.instancePath)).to.deep.equal([
      '/vulnerabilities/1/product_status',
      '/vulnerabilities/2/product_status',
    ])
  })

  it('does not compare a product with itself', async function () {
    const result = await informativeTest_6_3_19_1({
      ...vendor([
        leaf('vers:semver/>1.0.0|<5.0.0', 'A'),
        leaf('vers:semver/>3.0.0|<7.0.0', 'A'),
      ]),
      vulnerabilities: [{ product_status: { known_affected: ['A'] } }],
    })
    expect(result.infos).to.have.length(0)
  })

  it('ignores invalid vers and non-vers ranges', async function () {
    const result = await informativeTest_6_3_19_1({
      ...vendor([
        leaf('vers:semver/>1.0.0|<5.0.0', 'A'),
        leaf('vers:semver/>1.0.0||', 'B'),
        leaf('>1|<5', 'C'),
        { category: 'product_version_range', name: 5 },
      ]),
      vulnerabilities: [
        { product_status: { known_affected: ['A', 'B', 'C'] } },
      ],
    })
    expect(result.infos).to.have.length(0)
  })
})
