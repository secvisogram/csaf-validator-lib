import { mandatoryTest_6_1_44 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_44.js'

describe('mandatoryTest_6_1_44', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_44({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('validates branches and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_44({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  serial_numbers: ['*P\\*\\*?\\*'],
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
      mandatoryTest_6_1_44({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                serial_numbers: ['*P\\*\\*?\\*'],
              },
            },
            {},
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('detects invalid serial numbers in branches', function () {
    expect(
      mandatoryTest_6_1_44({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  serial_numbers: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })

  it('detects invalid serial numbers in product_paths', function () {
    expect(
      mandatoryTest_6_1_44({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                product_identification_helper: {
                  serial_numbers: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })
})
