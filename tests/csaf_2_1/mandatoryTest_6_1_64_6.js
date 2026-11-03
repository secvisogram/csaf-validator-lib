import { mandatoryTest_6_1_64_6 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_6.js'

describe('mandatoryTest_6_1_64_6', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_6({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('fails for duplicate entity ids', function () {
    const result = mandatoryTest_6_1_64_6({
      document: {
        involvement: {
          entities: [
            { category: 'discoverer', entity_id: 'EID-0001' },
            { category: 'vendor', entity_id: 'EID-0002' },
            { category: 'discoverer', entity_id: 'EID-0001' },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: '/document/involvement/entities/2/entity_id',
        message: 'entity_id EID-0001 was already defined',
      },
    ])
  })

  it('passes for distinct entity ids', function () {
    const result = mandatoryTest_6_1_64_6({
      document: {
        involvement: {
          entities: [
            { category: 'discoverer', entity_id: 'EID-0001' },
            { category: 'vendor', entity_id: 'EID-0002' },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors).to.deep.equal([])
  })
})
