import assert from 'node:assert'
import { recommendedTest_6_2_42 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_42.js'

/**
 * Builds a minimal document containing a single branch path with a leaf
 * product that carries the given product_identification_helper.
 * @param {object} productIdentificationHelper
 */
function docWithBranches(productIdentificationHelper) {
  return {
    product_tree: {
      branches: [
        {
          category: 'vendor',
          name: 'Example Company',
          branches: [
            {
              category: 'product_name',
              name: 'Product A',
              branches: [
                {
                  category: 'product_version',
                  name: '2.2.0',
                  product: {
                    product_id: 'CSAFPID-9080700',
                    name: 'Example Company Product A 2.2.0',
                    product_identification_helper: productIdentificationHelper,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  }
}

describe('recommendedTest_6_2_42', function () {
  it('returns no warnings for an empty document', function () {
    assert.equal(recommendedTest_6_2_42({}).warnings.length, 0)
  })

  it('returns no warnings when input fails schema validation (lines 107-108)', function () {
    assert.equal(
      recommendedTest_6_2_42({ product_tree: 'invalid' }).warnings.length,
      0
    )
  })

  it('skips branches without category and name', function () {
    assert.equal(
      recommendedTest_6_2_42({
        product_tree: {
          branches: [
            {
              branches: [
                {
                  category: 'product_version',
                  name: '2.2.0',
                  product: {
                    product_id: 'CSAFPID-0001',
                    name: 'Unnamed Product 2.2.0',
                    product_identification_helper: {
                      cpe: 'cpe:2.3:a:example:product_a:2.2.0:*:*:*:*:*:*:*',
                    },
                  },
                },
              ],
            },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('skips CPE that does not start with "cpe:2.3:"', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({ cpe: 'cpe:/a:example:product_a:2.2.0' })
      ).warnings.length,
      0
    )
  })

  it('skips CPE that does not contain 13 colon-separated parts', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({ cpe: 'cpe:2.3:a:example:product_a' })
      ).warnings.length,
      0
    )
  })

  it('skips branch categories that have no CPE index mapping', function () {
    assert.equal(
      recommendedTest_6_2_42({
        product_tree: {
          branches: [
            {
              category: 'product_family',
              name: 'My Family',
              branches: [
                {
                  category: 'product_version',
                  name: '2.2.0',
                  product: {
                    product_id: 'CSAFPID-0002',
                    name: 'My Family 2.2.0',
                    product_identification_helper: {
                      cpe: 'cpe:2.3:a:example:product_a:2.2.0:*:*:*:*:*:*:*',
                    },
                  },
                },
              ],
            },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('skips branch categories that have no PURL component mapping', function () {
    assert.equal(
      recommendedTest_6_2_42({
        product_tree: {
          branches: [
            {
              category: 'architecture',
              name: 'x86_64',
              branches: [
                {
                  category: 'product_version',
                  name: '2.2.0',
                  product: {
                    product_id: 'CSAFPID-0003',
                    name: 'Product 2.2.0 x86_64',
                    product_identification_helper: {
                      purls: ['pkg:generic/example/product_a@2.2.0'],
                    },
                  },
                },
              ],
            },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('warns when CPE version does not match branch version', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({
          cpe: 'cpe:2.3:a:example:product_a:9.9.9:*:*:*:*:*:*:*',
        })
      ).warnings.length,
      1
    )
  })

  it('warns when PURL component contains a wildcard but branch name does not', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({ purls: ['pkg:generic/example/product_a@2.2.*'] })
      ).warnings.length,
      2
    )
  })

  it('warns when CPE counterpart for branch category is not set', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({
          cpe: 'cpe:2.3:a:example:product_a:*:*:*:*:*:*:*:*',
        })
      ).warnings.length,
      1
    )
  })

  it('warns when CPE counterpart contains a wildcard but branch name does not', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({
          cpe: 'cpe:2.3:a:example:product_a:2.2.*:*:*:*:*:*:*:*',
        })
      ).warnings.length,
      2
    )
  })

  it('returns no warnings for an invalid PURL string', function () {
    assert.equal(
      recommendedTest_6_2_42(
        docWithBranches({ purls: ['this-is-not-a-valid-purl'] })
      ).warnings.length,
      0
    )
  })

  it('skips invalid child branches that do not pass schema validation', function () {
    assert.equal(
      recommendedTest_6_2_42({
        product_tree: {
          branches: [
            {
              category: 'vendor',
              name: 'Example Company',
              branches: [42, null, 'invalid'],
            },
          ],
        },
      }).warnings.length,
      0
    )
  })
})
