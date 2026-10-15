import { mandatoryTest_6_1_61 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_61.js'

describe('mandatoryTest_6_1_61', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_61({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('validates branches and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_61({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  skus: ['*P\\*\\*?\\*'],
                },
              },
              branches: [
                {
                  product: 'invalid',
                },
                {
                  branches: [{}],
                },
              ],
            },
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('validates product_paths and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_61({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                skus: ['*P\\*\\*?\\*'],
              },
            },
            {},
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('detects invalid SKUs in branches', function () {
    expect(
      mandatoryTest_6_1_61({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  skus: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })

  it('detects invalid SKUs in product_paths', function () {
    expect(
      mandatoryTest_6_1_61({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                product_identification_helper: {
                  skus: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })
})
