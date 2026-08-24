import { mandatoryTest_6_1_45 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_45.js'

describe('mandatoryTest_6_1_45', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_45({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('skips status draft', function () {
    expect(
      mandatoryTest_6_1_45({
        document: {
          distribution: {
            tlp: {
              label: 'CLEAR',
            },
          },
          tracking: {
            revision_history: [{ date: '2024-01-24T10:00:00.000Z' }],
            status: 'draft',
          },
        },
        vulnerabilities: [
          {
            disclosure_date: '2025-01-24T12:34:56.789Z',
          },
        ],
      }).isValid
    ).to.equal(true)
  })

  it('skips empty objects', function () {
    expect(
      mandatoryTest_6_1_45({
        document: {
          distribution: {
            tlp: {
              label: 'CLEAR',
            },
          },
          tracking: {
            revision_history: [
              {}, // should be ignored
              { date: '2024-01-24T10:00:00.000Z' },
            ],
            status: 'final',
          },
        },
        vulnerabilities: [
          {}, // should be ignored
          {
            disclosure_date: '2025-01-24T12:34:56.789Z',
          },
        ],
      }).isValid
    ).to.equal(false)
  })
})
