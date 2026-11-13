import { informativeTest_6_3_22 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_22 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_22({ document: 'mydoc' }).infos.length, 0)
  })

  it('returns no infos when product_paths is not an array', function () {
    const result = informativeTest_6_3_22({
      product_tree: {
        product_paths: 'not_an_array',
      },
    })
    assert.equal(result.infos.length, 0)
  })

  it('returns no infos when product_paths is empty', function () {
    const result = informativeTest_6_3_22({
      product_tree: {
        product_paths: [],
      },
    })
    assert.equal(result.infos.length, 0)
  })
})
