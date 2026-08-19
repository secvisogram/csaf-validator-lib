import { mandatoryTest_6_1_2 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_2.js'

describe('mandatory test 6.1.2', function () {
  describe('valid examples', function () {
    it('only runs on relevant documents', function () {
      expect(mandatoryTest_6_1_2({ product_tree: 'mydoc' }).isValid).to.equal(
        true
      )
    })
  })
  it('skips invalid full product names', function () {
    expect(
      mandatoryTest_6_1_2({
        product_tree: {
          full_product_names: [
            {
              product_id: { invalid: true },
            },
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('validates branches and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_2({
        product_tree: {
          branches: [
            {
              product: {
                product_id: 'CSAFPID-9080700',
              },
              branches: [
                {
                  product: 'CSAFPID-9080701',
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
      mandatoryTest_6_1_2({
        product_tree: {
          product_paths: [
            {
              full_product_name: {},
            },
            {},
          ],
        },
      }).isValid
    ).to.equal(true)
  })
})
