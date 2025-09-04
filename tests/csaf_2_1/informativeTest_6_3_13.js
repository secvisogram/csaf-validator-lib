import assert from 'node:assert'
import { informativeTest_6_3_13 } from '../../csaf_2_1/informativeTests.js'
import { expect } from 'chai'

const failingTestWithNotConsideredObject = {
  product_tree: {
    full_product_names: [
      {
        product_id: 'CSAFPID-9080700',
        name: 'Product A',
      },
    ],
  },
  vulnerabilities: [
    {
      metrics: [
        {},
        {
          content: {
            ssvc_v2: {
              id: 'CVE-1900-0001',
              schemaVersion: '1-0-1',
              selections: [
                {
                  name: 'Mission Impact',
                  namespace: 'ssvc',
                  values: ['Non-Essential Degraded'],
                  version: '1.0.0',
                },
              ],
              timestamp: '2024-01-24T10:00:00.000Z',
            },
          },
        },
      ],
    },
  ],
}

describe('informativeTest_6_3_13', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_13({ document: 'mydoc' }).infos.length, 0)
  })

  it('test input schema with not considered json object in vulnerabilities', async function () {
    const result = informativeTest_6_3_13(failingTestWithNotConsideredObject)
    expect(result.infos.length).to.eq(1)
  })
})
