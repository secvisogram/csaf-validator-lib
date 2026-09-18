import { mandatoryTest_6_1_24 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_24', function () {
  it.each([
    'acting_entity_refs',
    'dl_vuln_ids',
    'group_ids',
    'product_ids',
    'receiving_entity_refs',
    'referenced_action_ids',
  ])('fails if %s property has duplicate values', function (setName) {
    /** @type {Record<string, string[]>} */
    const action = {
      acting_entity_refs: [],
      dl_vuln_ids: [],
      group_ids: [],
      product_ids: [],
      receiving_entity_refs: [],
      referenced_action_ids: [],
    }
    action[setName] = ['duplicate', 'duplicate']
    const result = mandatoryTest_6_1_24({
      document: {
        involvement: {
          actions: [
            {
              action_id: 'ACN-1',
              ...action,
            },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
    expect(result.errors).to.deep.equal([
      {
        instancePath: `/document/involvement/actions/0`,
        message: `The list of actions contains an item which has duplicate entries in \`${setName}\``,
      },
    ])
  })
})
