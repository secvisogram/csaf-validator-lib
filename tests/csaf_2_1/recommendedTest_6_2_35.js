import assert from 'node:assert'
import { recommendedTest_6_2_35 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_35', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_35({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })
  it('skips empty objects', function () {
    assert.equal(
      recommendedTest_6_2_35({
        document: {
          distribution: {
            tlp: {
              label: 'CLEAR',
            },
          },
        },
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v1: {}, // should be ignored
                },
              },
            ],
          },
          {
            metrics: [
              {
                content: {
                  ssvc_v1: {
                    selections: [
                      {
                        namespace: 'x_custom',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      }).warnings.length,
      1
    )
  })
})
