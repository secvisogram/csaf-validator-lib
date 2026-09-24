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
    expect(result.errors.length).to.equal(2)
    expect(result.errors).to.deep.equal([
      {
        instancePath: `/document/tracking/revision_history`,
        message: `missing revision history item with number \`3.0.0\` at all`,
      },
      {
        instancePath: `/document/tracking/revision_history`,
        message: `missing revision history item with number \`4.0.0\` at all`,
      },
    ])
  })

  it('passes when the precondition does not match (revision_history is not an array)', function () {
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: 'not-an-array',
        },
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('passes an empty revision history', function () {
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [],
        },
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('ignores a non-numeric version number that appears after the first entry', function () {
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [
            { date: '2026-01-01T10:00:00.000Z', number: '1' },
            { date: '2026-01-02T10:00:00.000Z', number: 'invalid' },
            { date: '2026-01-03T10:00:00.000Z', number: '2' },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors.length).to.equal(0)
  })

  it('reports a lower major version as missing when it was not previously flagged as missing (1, 2, 5, 0)', function () {
    // `0` appears after `5` but was never recorded as missing.
    // The only gap detected so far is 3 & 4 between 2 and 5.
    // So it must be added as a newly discovered missing version instead of being marked as found.
    const result = mandatoryTest_6_1_21({
      document: {
        tracking: {
          revision_history: [
            { date: '2026-01-01T10:00:00.000Z', number: '1' },
            { date: '2026-01-02T10:00:00.000Z', number: '2' },
            { date: '2026-01-03T10:00:00.000Z', number: '5' },
            { date: '2026-01-04T10:00:00.000Z', number: '0' },
          ],
        },
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors).to.deep.equal([
      {
        instancePath: `/document/tracking/revision_history`,
        message: `missing revision history item with number \`3\` at all`,
      },
      {
        instancePath: `/document/tracking/revision_history`,
        message: `missing revision history item with number \`4\` at all`,
      },
      {
        instancePath: `/document/tracking/revision_history`,
        message: `missing revision history item with number \`0\` at all`,
      },
    ])
  })
})
