import assert from 'node:assert'
import { informativeTest_6_3_15 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_15', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_15({ document: 'mydoc' }).infos.length, 0)
  })
  it('test input schema with not considered json object in vulnerabilities', function () {
    assert.equal(
      informativeTest_6_3_15({
        document: {
          distribution: {
            tlp: {
              label: 'GREEN',
            },
          },
        },
        vulnerabilities: [
          {},
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
                        name: 'Technical Impact',
                        namespace: 'ssvc/additional-technical-impacts',
                        values: ['Total'],
                        version: '1.0.0',
                      },
                      {
                        name: 'Technical Impact',
                        values: ['Total'],
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
      }).infos.length,
      1
    )
  })
})
