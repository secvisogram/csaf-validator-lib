import assert from 'node:assert'
import { recommendedTest_6_2_32 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_32', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_32({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('skips product_tree when it is not an object', function () {
    const result = recommendedTest_6_2_32({ product_tree: 'not-an-object' })
    assert.equal(result.warnings.length, 0)
  })

  it('skips product_paths when full_product_name is not an object', function () {
    const result = recommendedTest_6_2_32({
      product_tree: {
        product_paths: [
          { full_product_name: 'not-an-object' },
          {
            full_product_name: {
              product_id: 'PROD-A',
              product_identification_helper: { serial_numbers: ['SN-UNIQUE'] },
            },
          },
        ],
      },
    })
    assert.equal(result.warnings.length, 0)
  })

  it('skips branches whose product field is not an object', function () {
    const result = recommendedTest_6_2_32({
      product_tree: {
        branches: [
          {
            branches: [{ product: 'not-an-object' }],
          },
        ],
      },
    })
    assert.equal(result.warnings.length, 0)
  })

  it('warns when x_generic_uri objects are equal but key order differs', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            product_id: 'PROD-A',
            name: 'Product A',
            product_identification_helper: {
              x_generic_uris: [
                {
                  namespace: 'https://example.com/nsTest2',
                  uri: 'https://example.com/id/1Test2',
                },
              ],
            },
          },
          {
            product_id: 'PROD-B',
            name: 'Product B',
            product_identification_helper: {
              x_generic_uris: [
                {
                  uri: 'https://example.com/id/1Test2',
                  namespace: 'https://example.com/nsTest2',
                },
              ],
            },
          },
        ],
      },
    }
    assert.equal(recommendedTest_6_2_32(doc).warnings.length, 1)
  })

  it('warns when file_hashes objects are equal for different products', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            product_id: 'PROD-A',
            name: 'Product A',
            product_identification_helper: {
              hashes: [
                {
                  filename: 'firmware.bin',
                  file_hashes: [{ algorithm: 'sha256', value: 'abc123' }],
                },
              ],
            },
          },
          {
            product_id: 'PROD-B',
            name: 'Product B',
            product_identification_helper: {
              hashes: [
                {
                  filename: 'firmware.bin',
                  file_hashes: [{ algorithm: 'sha256', value: 'abc123' }],
                },
              ],
            },
          },
        ],
      },
    }
    assert.equal(recommendedTest_6_2_32(doc).warnings.length, 1)
  })
})
