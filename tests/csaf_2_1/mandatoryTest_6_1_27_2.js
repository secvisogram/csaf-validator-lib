import { mandatoryTest_6_1_27_2 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_27_2.js'

describe('mandatoryTest_6_1_27_2', function () {
  it('only runs on documents matching the input schema', function () {
    expect(
      mandatoryTest_6_1_27_2({
        document: 'invalid json',
      }).isValid
    ).to.equal(true)
  })

  it('returns valid for documents with irrelevant category', function () {
    expect(
      mandatoryTest_6_1_27_2({
        document: { category: 'csaf_base' },
      }).isValid
    ).to.equal(true)
  })

  it('returns valid when no references are present and the category is not relevant', function () {
    expect(
      mandatoryTest_6_1_27_2({
        document: { category: 'csaf_base' },
      }).isValid
    ).to.equal(true)
  })

  it('returns invalid for a relevant document without references at all', function () {
    const { isValid, errors } = mandatoryTest_6_1_27_2({
      document: { category: 'csaf_informational_advisory' },
    })
    expect(isValid).to.equal(false)
    expect(errors).to.deep.equal([
      {
        instancePath: '/document/references',
        message:
          '`csaf_informational_advisory` must have at least one document reference with category `external`',
      },
    ])
  })

  it('returns invalid for a relevant document without an external reference', function () {
    expect(
      mandatoryTest_6_1_27_2({
        document: {
          category: 'csaf_security_incident_response',
          references: [{ category: 'self' }],
        },
      }).isValid
    ).to.equal(false)
  })

  it('returns valid for a relevant document with an external reference', function () {
    expect(
      mandatoryTest_6_1_27_2({
        document: {
          category: 'csaf_superseded',
          references: [{ category: 'external' }],
        },
      }).isValid
    ).to.equal(true)
  })
})
