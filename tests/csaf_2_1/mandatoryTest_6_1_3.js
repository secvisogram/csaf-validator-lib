import assert from 'node:assert/strict'
import { mandatoryTest_6_1_3 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_3.js'

describe('mandatoryTest_6_1_3 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_3({ document: 'mydoc' }).isValid, true)
  })

  it('returns valid when product_paths is not an array', function () {
    const doc = mandatoryTest_6_1_3({
      document: 'mydoc',
      product_tree: {
        product_paths: 'not_an_array',
      },
    })
    assert.equal(doc.isValid, true)
    assert.equal(doc.errors.length, 0)
  })
})
