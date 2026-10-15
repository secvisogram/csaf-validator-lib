import { mandatoryTest_6_1_10 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_10.js'

describe('mandatoryTest_6_1_10', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_10({ document: 'mydoc' }).isValid).to.equal(true)
  })
})
