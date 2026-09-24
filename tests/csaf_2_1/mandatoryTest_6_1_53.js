import { mandatoryTest_6_1_53 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_53.js'

describe('mandatoryTest_6_1_53', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_53({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('skips vulnerability without first_known_exploitation_dates', function () {
    expect(
      mandatoryTest_6_1_53({
        vulnerabilities: [
          {}, // should be ignored
          {
            first_known_exploitation_dates: [
              {
                date: '2024-01-24T12:34:56.789Z',
                exploitation_date: '2024-01-24T13:00:00.000Z',
              },
            ],
          },
        ],
      }).isValid
    ).to.equal(false)
  })

  it('skips empty first_known_exploitation_date', function () {
    expect(
      mandatoryTest_6_1_53({
        vulnerabilities: [
          {
            first_known_exploitation_dates: [
              {}, // should be ignored
              {
                date: '2024-01-24T12:34:56.789Z',
                exploitation_date: '2024-01-24T13:00:00.000Z',
              },
            ],
          },
        ],
      }).isValid
    ).to.equal(false)
  })
})
