import { collectProductIdsFromFullProductPath } from '../../../csaf_2_1/mandatoryTests/shared/docProductUtils.js'

describe('docProductUtils', function () {
  it('only runs on relevant documents', function () {
    expect(
      collectProductIdsFromFullProductPath({ document: 'mydoc' }).length
    ).to.equal(0)
  })

  it('collects product_id from full_product_names', function () {
    const result = collectProductIdsFromFullProductPath({
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-0001' }],
      },
    })
    expect(result.length).to.equal(1)
    expect(result[0].instancePath).to.equal(
      '/product_tree/full_product_names/0/product_id'
    )
  })

  it('collects product_id from product_paths full_product_name', function () {
    const result = collectProductIdsFromFullProductPath({
      product_tree: {
        product_paths: [
          {
            full_product_name: {
              product_id: 'CSAFPID-0002',
            },
          },
        ],
      },
    })
    expect(result.length).to.equal(1)
    expect(result[0].instancePath).to.equal(
      '/product_tree/product_paths/0/full_product_name/product_id'
    )
  })

  it('collects product_id from branches', function () {
    const result = collectProductIdsFromFullProductPath({
      product_tree: {
        branches: [
          {
            product: { product_id: 'CSAFPID-0003' },
          },
        ],
      },
    })
    expect(result.length).to.equal(1)
    expect(result[0].instancePath).to.equal(
      '/product_tree/branches/0/product/product_id'
    )
  })

  it('traverses nested branches recursively', function () {
    const result = collectProductIdsFromFullProductPath({
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
    })
    expect(result.length).to.equal(1)
    expect(result[0].instancePath).to.equal(
      '/product_tree/branches/0/branches/0/product/product_id'
    )
  })
})
