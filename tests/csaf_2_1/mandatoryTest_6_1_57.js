import assert from 'node:assert'
import { mandatoryTest_6_1_57 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_57', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      mandatoryTest_6_1_57({ vulnerabilities: 'mydoc' }).errors.length,
      0
    )
  })

  it('passes when product_tree has no branches', function () {
    assert.equal(
      mandatoryTest_6_1_57({
        product_tree: {
          full_product_names: [
            {
              name: 'Example Company Controller A 1.0',
              product_id: 'CSAFPID-908070601',
            },
          ],
        },
      }).errors.length,
      0
    )
  })

  it('skips recursion when an intermediate branch has invalid branches property', function () {
    const result = mandatoryTest_6_1_57({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Vendor A',
            branches: [
              {
                category: 'product_name',
                name: 'Product A',
                branches: 'not-an-array',
              },
            ],
          },
        ],
      },
    })
    assert.equal(result.errors.length, 0)
    assert.equal(result.isValid, true)
  })
})
