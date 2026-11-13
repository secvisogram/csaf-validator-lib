import { recommendedTest_6_2_39_1 } from '../../csaf_2_1/recommendedTests.js'

/**
 * @param {object} opts
 * @param {any[]} [opts.vulnerabilities]
 * @param {object} [opts.product_tree]
 */
function makeDoc({ vulnerabilities = [], product_tree = undefined } = {}) {
  return {
    document: { category: 'csaf_security_advisory' },
    ...(product_tree ? { product_tree } : {}),
    vulnerabilities,
  }
}

describe('recommendedTest_6_2_39_1', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_39_1({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('returns no warnings when there are no vulnerabilities', function () {
    const result = recommendedTest_6_2_39_1({
      document: { category: 'csaf_security_advisory' },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('returns no warnings when a vulnerability has no product_status', function () {
    const result = recommendedTest_6_2_39_1(makeDoc({ vulnerabilities: [{}] }))
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when product_status.first_fixed is populated', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        vulnerabilities: [
          {
            product_status: {
              known_affected: ['CSAFPID-0001'],
              first_fixed: ['CSAFPID-0002'],
            },
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when productBranch is undefined -> anti-skip cannot fire -> skip wins', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        vulnerabilities: [
          {
            product_status: { known_affected: ['CSAFPID-0001'] },
            remediations: [
              {
                category: 'no_fix_planned',
                product_ids: ['CSAFPID-0001'],
              },
              {
                category: 'vendor_fix',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('warns when anti-skip condition is met', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        product_tree: {
          branches: [
            {
              branches: [
                {
                  branches: [
                    {
                      category: 'product_version_range',
                      name: 'vers:npm/<5.0.0',
                      product: {
                        product_id: 'CSAFPID-0001',
                      },
                    },
                    {
                      category: 'product_version_range',
                      name: '<5.0.0',
                      product: {
                        product_id: 'CSAFPID-0002',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        vulnerabilities: [
          {
            product_status: {
              known_affected: ['CSAFPID-0001', 'CSAFPID-0002'],
            },
            remediations: [
              {
                category: 'no_fix_planned',
                product_ids: ['CSAFPID-0001', 'CSAFPID-0002'],
              },
              {
                category: 'vendor_fix',
                product_ids: ['CSAFPID-0001', 'CSAFPID-0002'],
              },
            ],
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(2)
  })

  it('does not warns when branch failing to validateBranch', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        product_tree: {
          branches: [
            {
              branches: [
                {
                  category: 123,
                  product: {
                    product_id: 'CSAFPID-0001',
                  },
                },
              ],
            },
          ],
        },
        vulnerabilities: [
          {
            product_status: { known_affected: ['CSAFPID-0001'] },
            remediations: [
              {
                category: 'no_fix_planned',
                product_ids: ['CSAFPID-0001'],
              },
              {
                category: 'vendor_fix',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when skip indicator is given via group_ids', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        product_tree: {
          product_groups: [
            {
              group_id: 'CSAFGID-0001',
              product_ids: ['CSAFPID-0001', 'CSAFPID-0002'],
            },
          ],
        },
        vulnerabilities: [
          {
            product_status: { known_affected: ['CSAFPID-0001'] },
            remediations: [
              {
                category: 'no_fix_planned',
                group_ids: ['CSAFGID-0001'],
              },
            ],
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when remediation without product_ids and group_ids applies implicitly', function () {
    const result = recommendedTest_6_2_39_1(
      makeDoc({
        vulnerabilities: [
          {
            product_status: { known_affected: ['CSAFPID-0001'] },
            remediations: [
              {
                category: 'fix_planned',
              },
            ],
          },
        ],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })
})
