import { mandatoryTest_6_1_64_5 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_5.js'

describe('mandatoryTest_6_1_64_5', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_5({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('fails if an entity is referenced but no entities are defined at all', function () {
    const result = mandatoryTest_6_1_64_5({
      document: {
        involvement: {
          actions: [
            {
              acting_entity_refs: ['EID-0001'],
            },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
    expect(result.errors[0].message).to.equal(
      "the entity_id 'EID-0001' is not defined in the list of entities"
    )
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/0/acting_entity_refs/0'
    )
  })
})
