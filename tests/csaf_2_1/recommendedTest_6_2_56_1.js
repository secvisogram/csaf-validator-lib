import { recommendedTest_6_2_56_1 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_56_1.js'

/**
 * @param {Array<Record<string, unknown>>} actions
 */
function docWithActions(actions) {
  return { document: { involvement: { actions } } }
}

describe('recommendedTest_6_2_56_1', function () {
  it('skips documents without involvement', function () {
    expect(recommendedTest_6_2_56_1({ document: {} }).warnings.length).to.equal(
      0
    )
  })

  it('does not warn for a confirmation without referenced_action_ids', function () {
    const result = recommendedTest_6_2_56_1(
      docWithActions([
        {
          action_id: 'A',
          category: 'confirmation',
          date: '2024-01-01T00:00:00Z',
        },
      ])
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn if the date of the confirmation is not parseable', function () {
    const result = recommendedTest_6_2_56_1(
      docWithActions([
        {
          action_id: 'A',
          category: 'notification',
          date: '2024-01-01T00:00:00Z',
        },
        {
          action_id: 'B',
          category: 'confirmation',
          date: 'not a date',
          referenced_action_ids: ['A'],
        },
      ])
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn if the dates of the referenced actions are not parseable', function () {
    const result = recommendedTest_6_2_56_1(
      docWithActions([
        {
          action_id: 'A',
          category: 'notification',
          date: 'not a date',
        },
        {
          action_id: 'B',
          category: 'confirmation',
          date: '2024-01-01T00:00:00Z',
          referenced_action_ids: ['A'],
        },
      ])
    )
    expect(result.warnings.length).to.equal(0)
  })
})
