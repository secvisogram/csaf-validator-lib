import { recommendedTest_6_2_48 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_48.js'

describe('recommendedTest_6_2_48', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_48({}).warnings.length).to.equal(0)
  })

  it('does not warn when product_tree has no branches', function () {
    expect(
      recommendedTest_6_2_48({ product_tree: {} }).warnings.length
    ).to.equal(0)
  })

  it('skips invalid child branches that do not pass schema validation', function () {
    const result = recommendedTest_6_2_48({
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Open Source Company',
            branches: [42, null],
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
