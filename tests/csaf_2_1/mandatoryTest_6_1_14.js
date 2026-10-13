import { mandatoryTest_6_1_14 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_14.js'

describe('mandatoryTest_6_1_14', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_14({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })

  it('skips documents with invalid revision_history entries', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [
            { date: '2020-01-01T00:00:00+00:00', number: '1.0.0' },
            { date: '2020-01-01T00:00:00+00:00', number: 'invalid' },
          ],
        },
      },
    }

    expect(() => mandatoryTest_6_1_14(doc)).toBeTruthy()
    const result = mandatoryTest_6_1_14(doc)
    expect(result.isValid).to.equal(true)
    expect(result.errors).to.deep.equal([])
  })

  it('skip revision numbers with leading zeros', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [
            { date: '2020-01-01T00:00:00+00:00', number: '007' },
            { date: '2020-01-01T00:00:00+00:00', number: '8' },
          ],
        },
      },
    }

    expect(() => mandatoryTest_6_1_14(doc)).toBeTruthy()
    const result = mandatoryTest_6_1_14(doc)
    expect(result.isValid).to.equal(true)
    expect(result.errors).to.deep.equal([])
  })

  it('skip revision numbers that are too large for semver', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [
            { date: '2020-01-01T00:00:00+00:00', number: '1' },
            {
              date: '2020-01-02T00:00:00+00:00',
              number: '99999999999999999999999', // > MAX_SAFE_INTEGER
            },
          ],
        },
      },
    }

    const result = mandatoryTest_6_1_14(doc)
    expect(result.isValid).to.equal(true) // wird gefiltert statt Fehler zu werfen
    expect(result.errors).to.deep.equal([])
  })
})
