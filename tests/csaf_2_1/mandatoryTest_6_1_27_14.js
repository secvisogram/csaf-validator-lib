import { mandatoryTest_6_1_27_14 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_14.js'

describe('mandatoryTest_6_1_27_14', function () {
  it('only runs on documents matching the input schema', function () {
    expect(
      mandatoryTest_6_1_27_14({
        document: 'invalid json',
      }).isValid
    ).to.equal(true)
  })

  it('only runs on csaf_withdrawn and csaf_superseded documents', function () {
    expect(
      mandatoryTest_6_1_27_14({
        document: {
          category: 'unknown category',
        },
      }).isValid
    ).to.equal(true)
  })
})
