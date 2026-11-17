import { recommendedTest_6_2_56_2 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_56_2.js'

describe('recommendedTest_6_2_56_2', function () {
  it('skips documents without entity groups', function () {
    expect(recommendedTest_6_2_56_2({ document: {} }).warnings.length).to.equal(
      0
    )
  })

  it('does not warn for group with summary', function () {
    const result = recommendedTest_6_2_56_2({
      document: {
        involvement: {
          entity_groups: [{ entity_group_id: 'EGID-9001', summary: 'x' }],
        },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
