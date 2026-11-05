import { recommendedTest_6_2_50_2 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_50_2', function () {
  it('skips documents not matching the input schema', async function () {
    const result = await recommendedTest_6_2_50_2({
      product_tree: { branches: 'invalid' },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('skips documents not matching the input schema', async function () {
    const result = await recommendedTest_6_2_50_2({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                branches: [],
                name: 5,
              },
            ],
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('handles missing product trees, product statuses and unknown ids', async function () {
    expect(
      (await recommendedTest_6_2_50_2({ vulnerabilities: [{}] })).warnings
    ).to.have.length(0)
    expect(
      (
        await recommendedTest_6_2_50_2({
          product_tree: { branches: [{ category: 'vendor', name: 'X' }] },
          vulnerabilities: [{ product_status: { known_affected: ['NOPE'] } }],
        })
      ).warnings
    ).to.have.length(0)
  })

  it('ignores invalid vls siblings in recommendedTest_6_2_50_2', async function () {
    const branch = (
      /** @type {string} */ name,
      /** @type {string} */ productId
    ) => ({
      category: 'product_version_range',
      name,
      product: { name, product_id: productId },
    })
    const result = await recommendedTest_6_2_50_2({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [branch('>1|<5', 'A'), branch('>1||', 'B')],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: { known_affected: ['A'], known_not_affected: ['B'] },
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('ignores same group, unreferenced and non-vls products, and recurses into nested branches', async function () {
    const branch = (
      /** @type {string} */ name,
      /** @type {string} */ productId
    ) => ({
      category: 'product_version_range',
      name,
      product: { name, product_id: productId },
    })
    const result = await recommendedTest_6_2_50_2({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Example Company',
            branches: [
              {
                category: 'product_name',
                name: 'Nested',
                branches: [
                  branch('>1|<5', 'A'),
                  branch('>2|<6', 'B'),
                  branch('>3|<7', 'C'),
                  branch('vers:semver/>1|<5', 'D'),
                  { category: 'product_version_range', name: '>1|<5' },
                  { branches: [], name: 5 },
                ],
              },
            ],
          },
        ],
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['A'],
            last_affected: ['B'],
            known_not_affected: ['D'],
          },
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })

  const leaf = (
    /** @type {string} */ name,
    /** @type {string} */ productId
  ) => ({
    category: 'product_version_range',
    name,
    product: { name, product_id: productId },
  })

  const vendor = (/** @type {unknown[]} */ branches) => ({
    product_tree: {
      branches: [{ category: 'vendor', name: 'Example Company', branches }],
    },
  })

  it('reports each overlapping pair only once', async function () {
    const result = await recommendedTest_6_2_50_2({
      ...vendor([leaf('>1|<5', 'A'), leaf('>3|<7', 'B')]),
      vulnerabilities: [
        {
          product_status: { known_affected: ['A'], known_not_affected: ['B'] },
        },
      ],
    })
    expect(result.warnings).to.have.length(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/branches/0/product'
    )
  })

  it('considers all groups of a product', async function () {
    const result = await recommendedTest_6_2_50_2({
      ...vendor([leaf('>1|<5', 'A'), leaf('>3|<7', 'B')]),
      vulnerabilities: [
        { product_status: { known_affected: ['A', 'B'], fixed: ['A'] } },
      ],
    })
    expect(result.warnings).to.have.length(1)
  })

  it('treats products nested below a product version range as EPVR', async function () {
    const result = await recommendedTest_6_2_50_2({
      ...vendor([
        {
          category: 'product_version_range',
          name: '>1|<5',
          branches: [
            {
              category: 'architecture',
              name: 'x86',
              product: { name: 'A', product_id: 'A' },
            },
          ],
        },
        leaf('>3|<7', 'B'),
      ]),
      vulnerabilities: [
        {
          product_status: { known_affected: ['A'], known_not_affected: ['B'] },
        },
      ],
    })
    expect(result.warnings).to.have.length(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/branches/0/branches/0/product'
    )
  })
})
