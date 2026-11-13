import { mandatoryTest_6_1_6 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_6.js'

describe('mandatoryTest_6_1_6', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_6({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('skip the check if there is no product status', function () {
    expect(
      mandatoryTest_6_1_6({
        vulnerabilities: [{}],
      }).isValid
    ).to.equal(true)
  })
})
