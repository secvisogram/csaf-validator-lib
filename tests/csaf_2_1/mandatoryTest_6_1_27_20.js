import { mandatoryTest_6_1_27_20 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_20.js'

describe('mandatoryTest_6_1_27_20', function () {
  it('only runs on documents matching the input schema', function () {
    expect(
      mandatoryTest_6_1_27_20({
        document: 'invalid json',
      }).isValid
    ).to.equal(true)
  })

  it('only runs on csaf_vulnerability_report documents', function () {
    expect(
      mandatoryTest_6_1_27_20({
        document: {
          category: 'unknown category',
        },
        vulnerabilities: [],
      }).isValid
    ).to.equal(true)
  })

  it('only runs on documents with the language english or unspecified', function () {
    expect(
      mandatoryTest_6_1_27_20({
        document: {
          category: 'csaf_vulnerability_report',
          lang: 'de',
        },
        vulnerabilities: [
          {
            notes: [],
          },
        ],
      }).isValid
    ).to.equal(true)
  })
})
