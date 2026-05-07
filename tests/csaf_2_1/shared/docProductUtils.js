import assert from 'node:assert'
import { collectProductIdsFromFullProductPath } from '../../../csaf_2_1/mandatoryTests/shared/docProductUtils.js'

describe('docProductUtils', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      collectProductIdsFromFullProductPath({ document: 'mydoc' }).length,
      0
    )
  })

  it('skips full_product_name entries without product_id', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          full_product_names: [{ name: 'Product without ID' }],
        },
      },
    })
    assert.equal(result.length, 0)
  })

  it('collects product_id from full_product_names', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          full_product_names: [{ product_id: 'CSAFPID-0001' }],
        },
      },
    })
    assert.equal(result.length, 1)
    assert.equal(
      result[0].instancePath,
      '/product_tree/full_product_names/0/product_id'
    )
  })

  it('collects product_id from product_paths full_product_name', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          product_paths: [{}],
        },
      },
    })
    assert.equal(result.length, 1)
    assert.equal(
      result[0].instancePath,
      '/product_tree/product_paths/0/full_product_name/product_id'
    )
  })

  it('collects product_id from product_paths full_product_name', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                product_id: 'CSAFPID-0002',
              },
            },
          ],
        },
      },
    })
    assert.equal(result.length, 1)
    assert.equal(
      result[0].instancePath,
      '/product_tree/product_paths/0/full_product_name/product_id'
    )
  })

  it('collects product_id from branches', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          branches: [
            {
              product: { product_id: 'CSAFPID-0003' },
            },
          ],
        },
      },
    })
    assert.equal(result.length, 1)
    assert.equal(
      result[0].instancePath,
      '/product_tree/branches/0/product/product_id'
    )
  })

  it('traverses nested branches recursively', function () {
    const result = collectProductIdsFromFullProductPath({
      document: {
        product_tree: {
          branches: [
            {
              branches: [
                {
                  product: {
                    product_id: 'CSAFPID-0004',
                    name: 'Nested Product',
                  },
                },
              ],
            },
          ],
        },
      },
    })
    assert.equal(result.length, 1)
    assert.equal(
      result[0].instancePath,
      '/product_tree/branches/0/branches/0/product/product_id'
    )
  })
})
