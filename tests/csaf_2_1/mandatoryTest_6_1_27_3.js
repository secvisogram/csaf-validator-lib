import { mandatoryTest_6_1_27_3 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_3.js'

describe('mandatoryTest_6_1_27_3', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_27_3({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('returns valid for documents with irrelevant category', function () {
    expect(
      mandatoryTest_6_1_27_3({
        document: { category: 'csaf_base' },
        vulnerabilities: [{}],
      }).isValid
    ).to.equal(true)
  })

  it('returns invalid for documents with relevant category', function () {
    expect(
      mandatoryTest_6_1_27_3({
        document: { category: 'csaf_superseded' },
        vulnerabilities: [{}],
      }).isValid
    ).to.equal(false)
  })
})
