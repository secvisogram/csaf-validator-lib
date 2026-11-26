import { mandatoryTest_6_1_64_12 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_12.js'

/**
 * @param {object[]} actions
 * @param {object[]} [entity_groups]
 */
const docWith = (actions, entity_groups) => ({
  document: { involvement: { actions, entity_groups } },
})

const notification = {
  acting_entity_refs: ['EID-0001'],
  action_id: 'ACN-1',
  category: 'notification',
  receiving_entity_refs: ['EID-0002'],
}

describe('mandatoryTest_6_1_64_12', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_12({ document: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('detects a confirmation from an unmentioned entity', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith([
        notification,
        {
          acting_entity_refs: ['EID-0003'],
          action_id: 'ACN-2',
          category: 'confirmation',
          referenced_action_ids: ['ACN-1'],
        },
      ])
    )
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1/referenced_action_ids/0'
    )
    expect(result.errors[0].message).to.equal(
      'EID-0003 confirms in ACN-2 receiving action ACN-1, but ACN-1 does not list it as receiving entity'
    )
  })

  it('uses plural wording if several acting entities are unmentioned', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith(
        [
          notification,
          {
            acting_entity_refs: ['EGID-9001'],
            action_id: 'ACN-2',
            category: 'confirmation',
            referenced_action_ids: ['ACN-1'],
          },
        ],
        [
          {
            entity_group_id: 'EGID-9001',
            entity_ids: ['EID-0003', 'EID-0004'],
          },
        ]
      )
    )
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
    expect(result.errors[0].message).to.equal(
      'EID-0003, EID-0004 confirms in ACN-2 receiving action ACN-1, but ACN-1 does not list them as receiving entities'
    )
  })

  it('checks every action sharing a referenced action id', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith([
        notification,
        { ...notification, receiving_entity_refs: ['EID-0003'] },
        {
          acting_entity_refs: ['EID-0003'],
          action_id: 'ACN-2',
          category: 'confirmation',
          referenced_action_ids: ['ACN-1'],
        },
      ])
    )
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
  })

  it('ignores confirmations without referenced action ids', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith([
        notification,
        {
          acting_entity_refs: ['EID-0003'],
          action_id: 'ACN-2',
          category: 'confirmation',
        },
      ])
    )
    expect(result.isValid).to.equal(true)
  })

  it('ignores referenced action ids without a matching action', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith([
        {
          acting_entity_refs: ['EID-0003'],
          action_id: 'ACN-2',
          category: 'confirmation',
          referenced_action_ids: ['ACN-unknown'],
        },
      ])
    )
    expect(result.isValid).to.equal(true)
  })

  it('ignores self-referencing confirmations (reported by 6.1.64.11)', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith([
        notification,
        {
          acting_entity_refs: ['EID-0003'],
          action_id: 'ACN-2',
          category: 'confirmation',
          referenced_action_ids: ['ACN-2', 'ACN-1'],
        },
      ])
    )
    expect(result.isValid).to.equal(true)
  })

  it('accepts confirmations from mentioned entities and non-confirmations', function () {
    const result = mandatoryTest_6_1_64_12(
      docWith(
        [
          notification,
          {
            acting_entity_refs: ['EGID-9001'],
            action_id: 'ACN-2',
            category: 'confirmation',
            referenced_action_ids: ['ACN-1'],
          },
          {
            acting_entity_refs: ['EID-0003'],
            action_id: 'ACN-3',
            category: 'notification',
            referenced_action_ids: ['ACN-1'],
          },
        ],
        [{ entity_group_id: 'EGID-9001', entity_ids: ['EID-0002'] }]
      )
    )
    expect(result.isValid).to.equal(true)
  })
})
