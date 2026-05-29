import assert from 'node:assert'
import { recommendedTest_6_2_20 } from '../../csaf_2_1/recommendedTests.js'

const SCHEMA_URL = 'https://example.com/my-extension/schema/1.0.0.json'

describe('recommendedTest_6_2_20', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_20({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('returns no warning when $schema is not a string (root x_extensions)', function () {
    const doc = {
      x_extensions: [{ category: { type: 'string' } }],
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 0)
  })

  it('warns for x_extensions at root level', function () {
    const doc = {
      x_extensions: [{ $schema: SCHEMA_URL }],
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(result.warnings[0].instancePath, '/x_extensions/0/$schema')
  })

  it('warns for x_extensions in document', function () {
    const doc = {
      document: {
        x_extensions: [{ $schema: SCHEMA_URL }],
      },
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/document/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/full_product_names', function () {
    const doc = {
      product_tree: {
        full_product_names: [{ x_extensions: [{ $schema: SCHEMA_URL }] }],
      },
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/full_product_names/0/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/branches', function () {
    const doc = {
      product_tree: {
        branches: [{ product: { x_extensions: [{ $schema: SCHEMA_URL }] } }],
      },
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/branches/0/product/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in nested product_tree/branches', function () {
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
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/branches/0/branches/0/product/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in product_tree/product_paths', function () {
    const doc = {
      product_tree: {
        product_paths: [
          { full_product_name: { x_extensions: [{ $schema: SCHEMA_URL }] } },
        ],
      },
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/product_paths/0/full_product_name/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in vulnerabilities', function () {
    const doc = {
      vulnerabilities: [{ x_extensions: [{ $schema: SCHEMA_URL }] }],
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/vulnerabilities/0/x_extensions/0/$schema'
    )
  })

  it('warns for x_extensions in vulnerabilities/metrics/content', function () {
    const doc = {
      vulnerabilities: [
        {
          metrics: [{ content: { x_extensions: [{ $schema: SCHEMA_URL }] } }],
        },
      ],
    }
    const result = recommendedTest_6_2_20(doc)
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/vulnerabilities/0/metrics/0/content/x_extensions/0/$schema'
    )
  })
})
