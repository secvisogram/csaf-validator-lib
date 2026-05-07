import assert from 'node:assert'
import { recommendedTest_6_2_16 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_16', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_16({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('returns no warnings for invalid inputSchema (product_tree is not an object)', function () {
    const result = recommendedTest_6_2_16({
      product_tree: 'not-an-object',
    })
    assert.equal(result.warnings.length, 0)
  })

  it('skips invalid branch entries and does not throw', function () {
    const result = recommendedTest_6_2_16({
      product_tree: {
        branches: [{ product: 'not-an-object' }],
      },
    })
    assert.equal(result.warnings.length, 0)
  })

  it('skips invalid product_paths entries and does not throw', function () {
    const result = recommendedTest_6_2_16({
      product_tree: {
        product_paths: [{ full_product_name: 'not-an-object' }],
      },
    })
    assert.equal(result.warnings.length, 0)
  })

  it('warns when a product_paths entry is missing product_identification_helper', function () {
    const result = recommendedTest_6_2_16({
      product_tree: {
        product_paths: [
          {
            full_product_name: {
              name: 'Product A',
              product_id: 'CSAFPID-0001',
            },
          },
        ],
      },
    })
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/product_paths/0/full_product_name'
    )
  })
})
