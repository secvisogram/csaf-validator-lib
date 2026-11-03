import { mandatoryTest_6_1_64_4 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_4.js'

/**
 * @param {object[]} actions
 * @param {object[]} [entity_groups]
 */
const docWith = (actions, entity_groups) => ({
  document: { involvement: { actions, entity_groups } },
})

describe('mandatoryTest_6_1_64_4', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_4({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('detects an entity acting and receiving', function () {
    const result = mandatoryTest_6_1_64_4(
      docWith([
        {
          acting_entity_refs: ['EID-0001'],
          receiving_entity_refs: ['EID-0001'],
        },
      ])
    )
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/0'
    )
  })

  it('detects overlap through entity groups', function () {
    const result = mandatoryTest_6_1_64_4(
      docWith(
        [
          {
            acting_entity_refs: ['EID-0001'],
            receiving_entity_refs: ['EGID-0001'],
          },
        ],
        [{ entity_group_id: 'EGID-0001', entity_ids: ['EID-0001', 'EID-0002'] }]
      )
    )
    expect(result.isValid).to.equal(false)
  })

  it('accepts disjoint entities', function () {
    const result = mandatoryTest_6_1_64_4(
      docWith(
        [
          {
            acting_entity_refs: ['EID-0001'],
            receiving_entity_refs: ['EGID-0001'],
          },
          { acting_entity_refs: ['EID-0001'] },
        ],
        [{ entity_group_id: 'EGID-0001', entity_ids: ['EID-0002', 'EID-0003'] }]
      )
    )
    expect(result.isValid).to.equal(true)
  })
})
