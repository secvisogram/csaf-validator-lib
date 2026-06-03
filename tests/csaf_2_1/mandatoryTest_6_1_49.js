import assert from 'node:assert/strict'
import { mandatoryTest_6_1_49 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_49.js'
import { expect } from 'chai'

describe('mandatoryTest_6_1_49', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_49({ document: 'mydoc' }).isValid, true)
  })

  it('test input schema with empty json object in vulnerabilities', async function () {
    const failingInputSchemaTestWithEmptyVulnerability = {
      document: {
        tracking: {
          revision_history: [
            {
              date: '2024-01-24T10:00:00.000Z',
            },
          ],
          status: 'final',
        },
      },
      vulnerabilities: [
        {}, // even this vulnerability is empty, the test should not fail due to the inputSchema
        {
          cve: 'CVE-1900-0001',
          metrics: [
            {
              content: {
                ssvc_v2: {
                  id: 'CVE-1900-0001',
                  schemaVersion: '1-0-1',
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(
      failingInputSchemaTestWithEmptyVulnerability
    )
    expect(result.errors.length).to.eq(1)
  })
  it('test input schema with empty/invalid dates in revision_history', async function () {
    const failingSchemaTestWithEmptyDates = {
      document: {
        tracking: {
          revision_history: [
            {
              number: '1',
            },
            {
              date: '',
              number: '2',
            },
            {
              date: '1.3.45',
              number: '2',
            },
          ],
          status: 'final',
        },
      },
      vulnerabilities: [
        {
          metrics: [
            {
              content: {
                ssvc_v2: {
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(failingSchemaTestWithEmptyDates)
    expect(result.errors.length).to.eq(0)
  })

  it('test input schema with empty json object in ssvc_2', async function () {
    const failingInputSchemaTestWithEmptyVulnerability = {
      document: {
        tracking: {
          revision_history: [
            {
              date: '2024-01-24T10:00:00.000Z',
            },
          ],
          status: 'final',
        },
      },
      vulnerabilities: [
        {
          cve: 'CVE-1900-0001',
          metrics: [
            {
              content: {
                epss: {}, // even this ssvc_v2 is here empty, the test should not fail due to the inputSchema
              },
            },
            {
              content: {
                ssvc_v2: {
                  id: 'CVE-1900-0001',
                  schemaVersion: '1-0-1',
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(
      failingInputSchemaTestWithEmptyVulnerability
    )
    expect(result.errors.length).to.eq(1)
  })

  it('test input schema with empty revision history', async function () {
    const failingInputSchemaTestWithEmptyVulnerability = {
      document: {
        tracking: {
          revision_history: [],
          status: 'final',
        },
      },
      vulnerabilities: [
        {
          cve: 'CVE-1900-0001',
          metrics: [
            {
              content: {
                ssvc_v2: {
                  id: 'CVE-1900-0001',
                  schemaVersion: '1-0-1',
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(
      failingInputSchemaTestWithEmptyVulnerability
    )
    expect(result.errors.length).to.eq(0)
  })

  it('test input schema with not existing revision history', async function () {
    const failingInputSchemaTestWithEmptyVulnerability = {
      document: {
        tracking: {
          status: 'final',
        },
      },
      vulnerabilities: [
        {
          cve: 'CVE-1900-0001',
          metrics: [
            {
              content: {
                ssvc_v2: {
                  id: 'CVE-1900-0001',
                  schemaVersion: '1-0-1',
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(
      failingInputSchemaTestWithEmptyVulnerability
    )
    expect(result.errors.length).to.eq(0)
  })

  it('test input schema with status interim', async function () {
    const failingInputSchemaTestWithEmptyVulnerability = {
      document: {
        tracking: {
          revision_history: [
            {
              date: '2024-01-24T10:00:00.000Z',
            },
          ],
          status: 'interim',
        },
      },
      vulnerabilities: [
        {}, // even this vulnerability is empty, the test should not fail due to the inputSchema
        {
          cve: 'CVE-1900-0001',
          metrics: [
            {
              content: {
                ssvc_v2: {
                  id: 'CVE-1900-0001',
                  schemaVersion: '1-0-1',
                  timestamp: '2024-07-13T10:00:00.000Z',
                },
              },
            },
          ],
        },
      ],
    }

    const result = mandatoryTest_6_1_49(
      failingInputSchemaTestWithEmptyVulnerability
    )
    expect(result.errors.length).to.eq(1)
  })
})
