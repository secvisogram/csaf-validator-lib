import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mandatoryTest_6_1_45 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_45.js'

test('mandatoryTest_6_1_45 - valid document with no vulnerabilities', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
        ],
      },
    },
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, true)
  assert.equal(result.errors.length, 0)
})

test('mandatoryTest_6_1_45 - valid document with vulnerabilities and valid disclosure dates', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
          {
            date: '2024-02-24T10:00:00.000Z',
            number: '2',
            summary: 'Updated version.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-01-20T10:00:00.000Z', // Earlier than newest revision
      },
      {
        disclosure_date: '2024-02-24T10:00:00.000Z', // Equal to newest revision
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, true)
  assert.equal(result.errors.length, 0)
})

test('mandatoryTest_6_1_45 - invalid document with vulnerabilities and invalid disclosure dates', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-02-24T10:00:00.000Z', // Later than newest revision
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, false)
  assert.equal(result.errors.length, 1)
  assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/disclosure_date')
})

test('mandatoryTest_6_1_45 - document with non-CLEAR TLP label', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'AMBER',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-02-24T10:00:00.000Z', // Later than newest revision, but TLP is not CLEAR
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, true)
  assert.equal(result.errors.length, 0)
})

test('mandatoryTest_6_1_45 - document with draft status', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'draft',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-02-24T10:00:00.000Z', // Later than newest revision, but status is draft
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, true)
  assert.equal(result.errors.length, 0)
})

test('mandatoryTest_6_1_45 - document with multiple revision history entries', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00.000Z',
            number: '1',
            summary: 'Initial version.',
          },
          {
            date: '2024-03-24T10:00:00.000Z', // This is the newest date
            number: '2',
            summary: 'Updated version.',
          },
          {
            date: '2024-02-24T10:00:00.000Z',
            number: '3',
            summary: 'Another update.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-03-24T09:00:00.000Z', // Earlier than newest revision
      },
      {
        disclosure_date: '2024-03-25T10:00:00.000Z', // Later than newest revision - should fail
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, false)
  assert.equal(result.errors.length, 1)
  assert.equal(result.errors[0].instancePath, '/vulnerabilities/1/disclosure_date')
})

test('mandatoryTest_6_1_45 - document with different timezones', () => {
  const doc = {
    document: {
      distribution: {
        tlp: {
          label: 'CLEAR',
        },
      },
      tracking: {
        status: 'final',
        revision_history: [
          {
            date: '2024-01-24T10:00:00+01:00', // UTC+1
            number: '1',
            summary: 'Initial version.',
          },
        ],
      },
    },
    vulnerabilities: [
      {
        disclosure_date: '2024-01-24T10:00:00+02:00', // UTC+2, earlier in absolute time
      },
      {
        disclosure_date: '2024-01-24T10:00:00Z', // UTC, later in absolute time - should fail
      },
    ],
  }

  const result = mandatoryTest_6_1_45(doc)
  assert.equal(result.isValid, false)
  assert.equal(result.errors.length, 1)
  assert.equal(result.errors[0].instancePath, '/vulnerabilities/1/disclosure_date')
})
