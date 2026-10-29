import { mandatoryTest_6_1_64_11 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_11.js'

describe('mandatoryTest_6_1_64_11', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_11({ document: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('detects self reference and longer circles', function () {
    const result = mandatoryTest_6_1_64_11({
      document: {
        involvement: {
          actions: [
            { action_id: 'ACN-1', referenced_action_ids: ['ACN-3'] },
            { action_id: 'ACN-2', referenced_action_ids: ['ACN-1'] },
            { action_id: 'ACN-3', referenced_action_ids: ['ACN-2'] },
            { action_id: 'ACN-4', referenced_action_ids: ['ACN-4'] },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(4)
  })

  it('ignores references to unknown actions', function () {
    const result = mandatoryTest_6_1_64_11({
      document: {
        involvement: {
          actions: [{ action_id: 'ACN-1', referenced_action_ids: ['ACN-X'] }],
        },
      },
    })
    expect(result.isValid).to.equal(true)
  })

  it('terminates on a cycle that does not contain the checked action', function () {
    const result = mandatoryTest_6_1_64_11({
      document: {
        involvement: {
          actions: [
            { action_id: 'ACN-1', referenced_action_ids: ['ACN-2'] },
            { action_id: 'ACN-2', referenced_action_ids: ['ACN-3'] },
            { action_id: 'ACN-3', referenced_action_ids: ['ACN-2'] },
          ],
        },
      },
    })
    expect(result.errors.map((e) => e.instancePath)).to.deep.equal([
      '/document/involvement/actions/1',
      '/document/involvement/actions/2',
    ])
  })

  it('accepts acyclic references', function () {
    const result = mandatoryTest_6_1_64_11({
      document: {
        involvement: {
          actions: [
            { action_id: 'ACN-1' },
            { action_id: 'ACN-2', referenced_action_ids: ['ACN-1'] },
            { action_id: 'ACN-3', referenced_action_ids: ['ACN-1', 'ACN-2'] },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(true)
  })
})
