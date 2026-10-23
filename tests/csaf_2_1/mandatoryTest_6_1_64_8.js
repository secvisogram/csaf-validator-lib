import { mandatoryTest_6_1_64_8 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_8.js'

describe('mandatoryTest_6_1_64_8', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_8({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('detects duplicate entity_group_id', function () {
    const result = mandatoryTest_6_1_64_8({
      document: {
        involvement: {
          entity_groups: [
            { entity_group_id: 'EGID-9001' },
            { entity_group_id: 'EGID-9001' },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/entity_groups/1/entity_group_id'
    )
  })
})
