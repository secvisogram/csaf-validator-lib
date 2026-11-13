import { recommendedTest_6_2_49 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_49.js'

describe('recommendedTest_6_2_49', function () {
  it('skips invalid child branches that do not pass schema validation', async function () {
    const result = await recommendedTest_6_2_49({
      product_tree: {
        branches: [42, null],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn for the special "all versions" vers string', async function () {
    const result = await recommendedTest_6_2_49({
      product_tree: {
        branches: [
          {
            category: 'product_version_range',
            name: 'vers:all/*',
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when only exclusion constraints are present', async function () {
    const result = await recommendedTest_6_2_49({
      product_tree: {
        branches: [
          {
            category: 'product_version_range',
            name: 'vers:intdot/!=5.1|!=6.3.0',
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
