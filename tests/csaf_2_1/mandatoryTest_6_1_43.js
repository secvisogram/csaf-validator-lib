import { mandatoryTest_6_1_43 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_43.js'
import { containsMultipleUnescapedStars } from '../../csaf_2_1/mandatoryTests/shared/wildcardUtils.js'

describe('mandatoryTest_6_1_43', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_43({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  describe('containMultipleUnescapedStars', function () {
    const testCases = /** @type {Array<[string, boolean]>} */ ([
      // Valid cases - single or no unescaped stars
      ['PA*', false],
      ['P?A*', false],
      ['P??A*', false],
      ['P???A*', false],
      ['P????A*', false],
      ['*PA', false],
      ['PA', false],
      ['*P\\*\\*?\\*', false],
      ['\\*PA*', false],
      ['PA\\*', false],
      ['PA\\**', false],
      ['*\\*', false],
      ['\\**', false],
      ['\\*\\*', false],
      ['\\**\\*', false],
      // Invalid cases - multiple unescaped stars
      ['P*A*', true],
      ['*P*A', true],
      ['*P*\\*?*', true],
      ['**', true],
      ['***', true],
      ['*\\**', true],
      ['*P*', true],
      ['P*A*B', true],
      ['P*A*B*', true],
      ['*P*\\*?*', true],
    ])

    testCases.forEach((testCase) => {
      it(`${testCase[0]} -> ${testCase[1]}`, () => {
        expect(containsMultipleUnescapedStars(testCase[0])).to.equal(
          testCase[1]
        )
      })
    })
  })

  it('validates branches and skips invalid ones', function () {
    expect(
      mandatoryTest_6_1_43({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  model_numbers: ['*P\\*\\*?\\*'],
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
      mandatoryTest_6_1_43({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                model_numbers: ['*P\\*\\*?\\*'],
              },
            },
            {},
          ],
        },
      }).isValid
    ).to.equal(true)
  })

  it('detects invalid model numbers in branches', function () {
    expect(
      mandatoryTest_6_1_43({
        product_tree: {
          branches: [
            {
              product: {
                product_identification_helper: {
                  model_numbers: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })

  it('detects invalid model numbers in product_paths', function () {
    expect(
      mandatoryTest_6_1_43({
        product_tree: {
          product_paths: [
            {
              full_product_name: {
                product_identification_helper: {
                  model_numbers: ['P*A*'],
                },
              },
            },
          ],
        },
      }).isValid
    ).to.equal(false)
  })
})
