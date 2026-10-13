import { mandatoryTest_6_1_62 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_62', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_62({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('is valid when discovery_date is not present', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [{ date: '2024-01-24T10:00:00.000Z' }],
          status: 'final',
        },
      },
      vulnerabilities: [{}],
    }

    expect(mandatoryTest_6_1_62(doc).isValid).to.equal(true)
  })

  it('passes when discovery_date is newer than the newest revision_history date but status is draft', function () {
    const doc = {
      document: {
        tracking: {
          revision_history: [{ date: '2024-01-24T10:00:00.000Z' }],
          status: 'draft',
        },
      },
      vulnerabilities: [
        {
          discovery_date: '2024-02-24T10:00:00.000Z',
        },
      ],
    }

    expect(mandatoryTest_6_1_62(doc).isValid).to.equal(true)
  })
})
