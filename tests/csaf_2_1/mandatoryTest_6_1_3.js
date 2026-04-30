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

  it('detects a circular definition across product paths', function () {
    const doc = mandatoryTest_6_1_3({
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'A',
            full_product_name: {
              name: 'B',
              product_id: 'B',
            },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'C',
              },
            ],
          },
          {
            beginning_product_reference: 'B',
            full_product_name: {
              name: 'C',
              product_id: 'C',
            },
            subpaths: [
              {
                category: 'installed_with',
                next_product_reference: 'D',
              },
            ],
          },
        ],
      },
    })

    assert.equal(doc.isValid, false)
    assert.equal(doc.errors.length, 1)
    assert.equal(
      doc.errors[0].instancePath,
      '/product_tree/product_paths/1/full_product_name/product_id'
    )
  })
})
