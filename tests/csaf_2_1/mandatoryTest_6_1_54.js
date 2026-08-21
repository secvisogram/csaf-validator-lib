import { mandatoryTest_6_1_54 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_54.js'

describe('mandatoryTest_6_1_54', function () {
  it('only runs on relevant documents', function () {
    expect(
      mandatoryTest_6_1_54({ vulnerabilities: 'mydoc' }).errors.length
    ).to.equal(0)
  })
})
