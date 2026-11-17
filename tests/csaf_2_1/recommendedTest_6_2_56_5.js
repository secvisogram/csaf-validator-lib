import { recommendedTest_6_2_56_5 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_56_5.js'

const doc = (/** @type {string} */ status, /** @type {string} */ date) => ({
  document: {
    involvement: { actions: [{ status, date }] },
    tracking: { revision_history: [{ date: '2024-01-24T10:00:00Z' }] },
  },
})

describe('recommendedTest_6_2_56_5', function () {
  it('skips documents without involvement', function () {
    expect(recommendedTest_6_2_56_5({ document: {} }).warnings.length).to.equal(
      0
    )
  })

  it('does not warn for planned actions', function () {
    expect(
      recommendedTest_6_2_56_5(doc('planned', '2024-03-02T15:00:00Z')).warnings
        .length
    ).to.equal(0)
  })

  it('does not warn if no revision date is parseable', function () {
    const result = recommendedTest_6_2_56_5({
      document: {
        involvement: {
          actions: [{ status: 'completed', date: '2024-03-02T15:00:00Z' }],
        },
        tracking: { revision_history: [{ date: 'not a date' }] },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
