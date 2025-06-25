import assert from 'node:assert/strict'
import { mandatoryTest_6_1_46 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_46.js'
import { expect } from 'chai'

const validInputSchemaTestWithEmptyVulnerability6_1_46 = {
  vulnerabilities: [
    {}, // even this vulnerability is empty, the test should not fail due to the inputSchema
    {
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
                  values: ['None'],
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

describe('mandatoryTest_6_1_46', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_46({ document: 'mydoc' }).isValid, true)
  })
  it('test input schema with empty json object in vulnerabilities', async function () {
    const result = mandatoryTest_6_1_46(
      validInputSchemaTestWithEmptyVulnerability6_1_46
    )
    expect(result.errors.length).to.eq(0)
  })
})
