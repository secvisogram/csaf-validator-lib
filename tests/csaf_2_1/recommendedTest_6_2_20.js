import { recommendedTest_6_2_20 } from '../../csaf_2_1/recommendedTests.js'

const SCHEMA_URL = 'https://example.com/my-extension/schema/1.0.0.json'

describe('recommendedTest_6_2_20', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_20({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).to.equal(0)
  })

  it('warns for x_extensions at root level', async function () {
    const doc = {
      x_extensions: [{ $schema: SCHEMA_URL }],
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/x_extensions/0/$schema')
    expect(result.warnings[0].message).to.contain(SCHEMA_URL)
    expect(result.warnings[0].message).to.contain('class: unknown')
  })

  it('warns for x_extensions in document', async function () {
    const doc = {
      document: {
        x_extensions: [{ $schema: SCHEMA_URL }],
      },
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/document/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/full_product_names', async function () {
    const doc = {
      product_tree: {
        full_product_names: [{ x_extensions: [{ $schema: SCHEMA_URL }] }],
      },
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/full_product_names/0/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/branches', async function () {
    const doc = {
      product_tree: {
        branches: [{ product: { x_extensions: [{ $schema: SCHEMA_URL }] } }],
      },
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/product/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in nested product_tree/branches', async function () {
    const doc = {
      product_tree: {
        branches: [
          {
            branches: [
              { product: { x_extensions: [{ $schema: SCHEMA_URL }] } },
            ],
          },
        ],
      },
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/branches/0/product/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/product_paths', async function () {
    const doc = {
      product_tree: {
        product_paths: [
          { full_product_name: { x_extensions: [{ $schema: SCHEMA_URL }] } },
        ],
      },
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/product_paths/0/full_product_name/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in vulnerabilities', async function () {
    const doc = {
      vulnerabilities: [{ x_extensions: [{ $schema: SCHEMA_URL }] }],
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/0/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in vulnerabilities/metrics/content', async function () {
    const doc = {
      vulnerabilities: [
        {
          metrics: [{ content: { x_extensions: [{ $schema: SCHEMA_URL }] } }],
        },
      ],
    }
    const result = await recommendedTest_6_2_20(doc)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/0/metrics/0/content/x_extensions/0/$schema'
    )
  })
})
