import { mandatoryTest_6_1_64_10 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_10.js'

describe('mandatoryTest_6_1_64_10', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_10({ document: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('detects duplicate action_id', function () {
    const result = mandatoryTest_6_1_64_10({
      document: {
        involvement: {
          actions: [{ action_id: 'ACN-1' }, { action_id: 'ACN-1' }],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1/action_id'
    )
  })
})
