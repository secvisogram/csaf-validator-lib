import { informativeTest_6_3_14 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_14', function () {
  it('only runs on relevant documents', function () {
    expect(informativeTest_6_3_14({ document: 'mydoc' }).infos.length).toBe(0)
  })

  it('skips metrics without selections', function () {
    expect(
      informativeTest_6_3_14({
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
                content: {},
                products: ['CSAFPID-9080700'],
              },
            ],
          },
        ],
      }).infos.length
    ).toBe(0)
  })

  it('does not report unregistered namespaces when the document is labeled TLP:CLEAR', function () {
    expect(
      informativeTest_6_3_14({
        document: {
          distribution: {
            tlp: {
              label: 'CLEAR',
            },
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
                    selections: [
                      {
                        name: 'Technical Impact',
                        namespace: 'acme',
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
      }).infos.length
    ).toBe(0)
  })

  it('skips selections without namespace and reports the unregistered ones', function () {
    expect(
      informativeTest_6_3_14({
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
                  ssvc_v2: {
                    id: 'CVE-1900-0001',
                    schemaVersion: '1-0-1',
                    selections: [
                      {
                        name: 'Technical Impact',
                        namespace: 'acme',
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
      }).infos.length
    ).toBe(1)
  })
})
