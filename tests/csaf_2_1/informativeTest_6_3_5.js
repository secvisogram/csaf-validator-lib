import assert from 'node:assert'
import { informativeTest_6_3_5 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_5', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_5({ document: 'mydoc' }).infos.length, 0)
  })

  it('skip invalid hash value', function () {
    const result = informativeTest_6_3_5({
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700',
            product_identification_helper: {
              hashes: [
                {
                  filename: 'product_a.so',
                },
              ],
            },
          },
        ],
      },
    })
    assert.equal(result.infos.length, 0)
  })

  it('detects short hash in product_paths', function () {
    const result = informativeTest_6_3_5({
      product_tree: {
        product_paths: [
          {
            full_product_name: {
              name: 'Product A',
              product_id: 'CSAFPID-0001',
              product_identification_helper: {
                hashes: [
                  {
                    file_hashes: [
                      {
                        algorithm: 'md5',
                        value: 'd41d8cd98f00b204e9800998ecf8427e',
                      },
                    ],
                    filename: 'product_b.so',
                  },
                ],
              },
            },
          },
        ],
      },
    })
    assert.equal(result.infos.length, 1)
    assert.equal(
      result.infos[0].instancePath,
      '/product_tree/product_paths/0/full_product_name/product_identification_helper/hashes/0/file_hashes/0/value'
    )
  })

  it('detects short hash in branches', function () {
    const result = informativeTest_6_3_5({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Vendor A',
            product: {
              name: 'Product A',
              product_id: 'CSAFPID-0001',
              product_identification_helper: {
                hashes: [
                  {
                    file_hashes: [
                      {
                        algorithm: 'md5',
                        value: 'd41d8cd98f00b204e9800998ecf8427e',
                      },
                    ],
                    filename: 'product_c.so',
                  },
                ],
              },
            },
          },
        ],
      },
    })
    assert.equal(result.infos.length, 1)
    assert.equal(
      result.infos[0].instancePath,
      '/product_tree/branches/0/product/product_identification_helper/hashes/0/file_hashes/0/value'
    )
  })
})
