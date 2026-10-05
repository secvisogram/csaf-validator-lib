import { informativeTest_6_3_11 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_11', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await informativeTest_6_3_11({ document: 'mydoc' })).infos.length
    ).to.equal(0)
  })

  it('handles a product_tree without branches', async function () {
    expect(
      (
        await informativeTest_6_3_11({
          product_tree: {},
        })
      ).infos.length
    ).to.equal(0)
  })

  it('validates branches and skips invalid ones', async function () {
    expect(
      (
        await informativeTest_6_3_11({
          product_tree: {
            branches: [{ category: 123 }],
          },
        })
      ).infos.length
    ).to.equal(0)
  })
})
