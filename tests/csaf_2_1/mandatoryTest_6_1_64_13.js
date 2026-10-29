import { mandatoryTest_6_1_64_13 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_13.js'

describe('mandatoryTest_6_1_64_13', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_13({ document: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('detects missing referenced_action_ids', function () {
    const result = mandatoryTest_6_1_64_13({
      document: {
        involvement: {
          actions: [{ category: 'notification' }, { category: 'dispute' }],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors[0].instancePath).to.equal(
      '/document/involvement/actions/1'
    )
  })
})
