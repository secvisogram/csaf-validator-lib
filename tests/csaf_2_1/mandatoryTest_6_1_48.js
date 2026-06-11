import assert from 'node:assert/strict'
import { mandatoryTest_6_1_48 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_48.js'
import { expect } from 'chai'

const failingInputSchemaTestWithEmptyVulnerability6_1_48 = {
  vulnerabilities: [
    {}, // even this vulnerability is empty, the test should run
    {
      cve: 'CVE-1900-0001',
      metrics: [
        {
          content: {
            ssvc_v1: {
              id: 'CVE-1900-0001',
              schemaVersion: '1-0-1',
              selections: [
                {
                  name: 'Mission Impact',
                  namespace: 'ssvc',
                  values: ['None', 'Degraded'],
                  version: '1.0.0',
                },
              ],
              timestamp: '2024-01-24T10:00:00.000Z',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

describe('mandatoryTest_6_1_48', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_48({ document: 'mydoc' }).isValid, true)
  })
  it('test input schema with empty json object in vulnerabilities', async function () {
    const result = mandatoryTest_6_1_48(
      failingInputSchemaTestWithEmptyVulnerability6_1_48
    )
    expect(result.errors.length).to.eq(1)
  })
})
