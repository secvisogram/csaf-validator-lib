import { mandatoryTest_6_1_13 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_13.js'

describe('mandatoryTest_6_1_13', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_13({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('skips invalid full product names', function () {
    expect(
      mandatoryTest_6_1_13({
        product_tree: {
          full_product_names: [
            {
              product_identification_helper: 'invalid',
            },
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('validates branches and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_13({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  purls: [
                    'pkg:oci/product-A@sha256%3Add134261219b2?repository_url=https://registry.example.com',
                  ],
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
      mandatoryTest_6_1_13({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                purls: [
                  'pkg:oci/product-A@sha256%3Add134261219b2?repository_url=https://registry.example.com',
                ],
              },
            },
            {},
          ],
        },
      }).isValid
    ).to.equal(true)
  })
})
