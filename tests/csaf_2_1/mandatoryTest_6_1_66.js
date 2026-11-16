import { mandatoryTest_6_1_66 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_66.js'

describe('mandatoryTest_6_1_66', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_66({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('fails with the "not determinable" message without revision_history', function () {
    const result = mandatoryTest_6_1_66({
      document: {
        tracking: {
          status: 'final',
          initial_release_date: '2024-01-22T10:00:00.000Z',
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.have.length(1)
    expect(result.errors[0].message).to.contain('could not be determined')
  })
})
