import { mandatoryTest_6_1_58 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_58', function () {
  it('only runs on relevant documents', function () {
    expect(
      mandatoryTest_6_1_58({ vulnerabilities: 'mydoc' }).errors.length
    ).to.equal(0)
  })

  it('passes when product_tree has no branches', function () {
    expect(
      mandatoryTest_6_1_58({
        product_tree: {
          full_product_names: [
            {
              name: 'Example Company Controller A 1.0',
              product_id: 'CSAFPID-908070601',
            },
          ],
        },
      }).errors.length
    ).to.equal(0)
  })

  it('skips recursion when a child branch has invalid branches property', function () {
    const result = mandatoryTest_6_1_58({
      product_tree: {
        branches: [
          {
            category: 'product_version',
            name: '1.0',
            branches: [
              {
                category: 'product_version_range',
                name: 'vers:intdot/<1.1',
                branches: 'not-an-array',
              },
            ],
          },
        ],
      },
    })
    expect(result.errors.length).to.equal(0)
    expect(result.isValid).to.equal(true)
  })

  it('reports all leaves under a conflicting branch', function () {
    const result = mandatoryTest_6_1_58({
      product_tree: {
        branches: [
          {
            category: 'product_version',
            name: '1.0',
            branches: [
              {
                category: 'product_version_range',
                name: 'vers:intdot/<1.1',
                branches: [
                  {
                    category: 'architecture',
                    name: 'x86',
                    product: {
                      name: 'Product x86',
                      product_id: 'CSAFPID-2',
                    },
                  },
                  {
                    category: 'architecture',
                    name: 'arm',
                    product: {
                      name: 'Product arm',
                      product_id: 'CSAFPID-3',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(2)
    const paths = result.errors.map((e) => e.instancePath)
    expect(
      paths.includes('/product_tree/branches/0/branches/0/branches/0/product')
    ).to.be.ok
    expect(
      paths.includes('/product_tree/branches/0/branches/0/branches/1/product')
    ).to.be.ok
  })
})
