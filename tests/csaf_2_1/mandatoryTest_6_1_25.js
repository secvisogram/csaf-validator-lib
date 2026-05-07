import assert from 'node:assert/strict'

import mandatoryTest_6_1_25 from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_25.js'

describe('mandatoryTest_6_1_25', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_25({ product_tree: 'mydoc' }).isValid, true)
  })

  it('detects duplicate hash algorithms in product_paths', function () {
    const result = mandatoryTest_6_1_25({
      product_tree: {
        product_paths: [
          {
            full_product_name: {
              name: 'Product A',
              product_id: 'CSAFPID-9080700',
              product_identification_helper: {
                hashes: [
                  {
                    file_hashes: [
                      { algorithm: 'md5', value: 'aabbcc' },
                      { algorithm: 'md5', value: 'ddeeff' },
                    ],
                    filename: 'product_a.so',
                  },
                ],
              },
            },
          },
        ],
      },
    })
    assert.equal(result.isValid, false)
  })

  it('detects duplicate hash algorithms in nested branches', function () {
    const result = mandatoryTest_6_1_25({
      product_tree: {
        branches: [
          {
            branches: [
              {
                product: {
                  product_identification_helper: {
                    hashes: [
                      {
                        file_hashes: [
                          { algorithm: 'sha256', value: 'aabbcc' },
                          { algorithm: 'sha256', value: 'ddeeff' },
                        ],
                        filename: 'product_a.so',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    })
    assert.equal(result.isValid, false)
  })

  it('passes when file_hashes is not an array', function () {
    assert.equal(
      mandatoryTest_6_1_25({
        product_tree: {
          full_product_names: [
            {
              product_identification_helper: {
                hashes: [
                  {
                    filename: 'product_a.so',
                    // file_hashes is missing entirely
                  },
                ],
              },
            },
          ],
        },
      }).isValid,
      true
    )
  })

  it('skips file_hashes entries without an algorithm', function () {
    const result = mandatoryTest_6_1_25({
      product_tree: {
        full_product_names: [
          {
            product_identification_helper: {
              hashes: [
                {
                  file_hashes: [{ value: 'aabbcc' }, { value: 'ddeeff' }],
                  filename: 'product_a.so',
                },
              ],
            },
          },
        ],
      },
    })
    assert.equal(result.isValid, true)
  })
})
