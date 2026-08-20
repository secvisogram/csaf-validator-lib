import { mandatoryTest_6_1_21 } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_21', function () {
  it('passes a reverse-ordered but complete revision history (2, 1)', function () {
    // also matches the scenario from oasis_csaf_tc-csaf_2_1-2024-6-1-14-12.json
    // which has same-date entries sorted by version number
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [
            {
              date: '2024-01-22T10:00:00.000Z',
              number: '2',
              summary: 'Second version.',
            },
            {
              date: '2024-01-22T10:00:00.000Z',
              number: '1',
              summary: 'Initial version.',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('passes an incomplete revision history (1, 2, 5)', function () {
    // Gap with two missing revisions (3 & 4)
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [
            {
              date: '2026-03-09T11:00:00.000Z',
              number: '1.0.0',
              summary: '1.0.0',
            },
            {
              date: '2026-03-10T11:00:00.000Z',
              number: '2.0.0',
              summary: '2.0.0',
            },
            {
              date: '2026-03-13T11:00:00.000Z',
              number: '5.0.0',
              summary: '5.0.0',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
    expect(result.errors).to.deep.equal([
      {
        instancePath: `/document/tracking/revision_history`,
        message: `major version 3 was omitted`,
      },
    ])
  })
})
