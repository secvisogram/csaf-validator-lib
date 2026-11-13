import { mandatoryTest_6_1_27_18 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_18.js'

describe('mandatoryTest_6_1_27_18', function () {
  it('only runs on documents matching the input schema', function () {
    expect(
      mandatoryTest_6_1_27_18({
        document: 'invalid json',
      }).isValid
    ).to.equal(true)
  })

  it('only runs on csaf_superseded documents', function () {
    expect(
      mandatoryTest_6_1_27_18({
        document: {
          category: 'unknown category',
          notes: [],
        },
      }).isValid
    ).to.equal(true)
  })
})
