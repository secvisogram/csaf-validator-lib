import assert from 'node:assert/strict'
import { mandatoryTest_6_1_47 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_47.js'
import { expect } from 'chai'

const failingInputSchemaTestWithEmptyVulnerability6_1_47 = {
  document: {},
  vulnerabilities: [
    {}, // even this vulnerability is empty, the test should run
    {
      cve: 'CVE-1900-0001',
      metrics: [
        {
          content: {
            ssvc_v2: {
              schemaVersion: '2.0.0',
              selections: [
                {
                  key: 'E',
                  namespace: 'ssvc',
                  values: [
                    {
                      key: 'N',
                    },
                  ],
                  version: '1.1.0',
                },
              ],
              target_ids: ['CVE-1900-0002'],
              timestamp: '2024-01-24T10:00:00.000Z',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

describe('mandatoryTest_6_1_47', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_47({ document: 'mydoc' }).isValid, true)
  })
  it('test input schema with empty json object in vulnerabilities', async function () {
    const result = mandatoryTest_6_1_47(
      failingInputSchemaTestWithEmptyVulnerability6_1_47
    )
    expect(result.errors.length).to.eq(1)
  })
  it('emits duplicate errors for one target_id when tracking.id rule and cve/ids rule both fire', async () => {
    const doc = {
      document: {
        category: 'csaf_vex',
        csaf_version: '2.1',
        lang: 'en-US',
        title: 'double-error reproduction',
        tracking: {
          id: 'TRACK-1',
          status: 'final',
          version: '1',
          initial_release_date: '2024-01-01T00:00:00.000Z',
          current_release_date: '2024-01-01T00:00:00.000Z',
          revision_history: [
            {
              number: '1',
              date: '2024-01-01T00:00:00.000Z',
              summary: 'initial',
            },
          ],
        },
        publisher: {
          category: 'vendor',
          name: 'ACME',
          namespace: 'https://example.com',
        },
      },
      vulnerabilities: [
        {
          cve: 'CVE-2024-0001',
          metrics: [
            {
              content: {
                ssvc_v2: {
                  // equals tracking.id
                  target_ids: ['TRACK-1'],
                },
              },
            },
          ],
        },
        {
          cve: 'CVE-2024-0002',
          metrics: [],
        },
      ],
    }

    const result = mandatoryTest_6_1_47(doc)

    // Current behavior: two errors for same location with different messages
    expect(result.isValid).eq(false)
    expect(result.errors.length).eq(2)

    const path = '/vulnerabilities/0/metrics/0/content/ssvc_v2/target_ids/0'
    expect(result.errors[0].instancePath).eq(path)
    expect(result.errors[0].message.startsWith('the ssvc id equals the ')).to.be
      .true
    expect(result.errors[1].instancePath).eq(path)
    expect(result.errors[1].message.startsWith('the ssvc id does neither ')).to
      .be.true
  })
})
