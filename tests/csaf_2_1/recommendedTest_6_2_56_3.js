import { recommendedTest_6_2_56_3 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_56_3.js'

const doc = (/** @type {unknown[]} */ entities, extra = {}) => ({
  document: { involvement: { entities, ...extra } },
})

describe('recommendedTest_6_2_56_3', function () {
  it('skips documents without entities', function () {
    expect(recommendedTest_6_2_56_3({ document: {} }).warnings.length).to.equal(
      0
    )
  })

  it('warns for unused entity', function () {
    const result = recommendedTest_6_2_56_3(doc([{ entity_id: 'EID-1' }]))
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/document/involvement/entities/0/entity_id'
    )
  })

  it('does not warn for entity used in an action or group', function () {
    const result = recommendedTest_6_2_56_3(
      doc([{ entity_id: 'EID-1' }, { entity_id: 'EID-2' }], {
        actions: [{ acting_entity_refs: ['EID-1'] }],
        entity_groups: [{ entity_ids: ['EID-2'] }],
      })
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('warns for unused entity if the entity group has no entity_ids', function () {
    const result = recommendedTest_6_2_56_3(
      doc([{ entity_id: 'EID-1' }], {
        entity_groups: [{ entity_group_id: 'EGID-1' }],
      })
    )
    expect(result.warnings.length).to.equal(1)
  })
})
