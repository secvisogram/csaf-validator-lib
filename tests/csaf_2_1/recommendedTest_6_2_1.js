import assert from 'node:assert'
import { recommendedTest_6_2_1 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_1', function () {
  it('should return no warnings for a document with a referenced product_id', async function () {
    assert.equal(
      (
        await recommendedTest_6_2_1({
          product_tree: {
            product_paths: [{ beginning_product_reference: 'CSAFPID-0001' }],
          },
        })
      ).warnings.length,
      0
    )
  })
})
