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
                  ssvc_v2: {}, // should be ignored
                },
              },
            ],
          },
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {
                    selections: [
                      {
                        namespace: 'x_com.example#custom',
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

  it('skips selections without a namespace', function () {
    assert.equal(
      recommendedTest_6_2_35({
        document: {
          distribution: { tlp: { label: 'CLEAR' } },
        },
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {
                    selections: [{}, { namespace: '' }],
                  },
                },
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warns for special purpose namespaces', function () {
    assert.equal(
      recommendedTest_6_2_35({
        document: {
          distribution: { tlp: { label: 'CLEAR' } },
        },
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {
                    selections: [
                      { namespace: 'x_example#test' },
                      { namespace: 'x_test#ref' },
                    ],
                  },
                },
              },
            ],
          },
        ],
      }).warnings.length,
      2
    )
  })

  it('warns for unregistered namespaces that look like special purpose (x_example.something)', function () {
    const result = recommendedTest_6_2_35({
      document: {
        distribution: { tlp: { label: 'CLEAR' } },
      },
      vulnerabilities: [
        {
          metrics: [
            {
              content: {
                ssvc_v2: {
                  selections: [
                    { namespace: 'x_example.unregistered#namespace' },
                    { namespace: 'x_test.org#ref' },
                  ],
                },
              },
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 2)
    assert.ok(
      result.warnings.every((w) =>
        w.message.includes('unregistered namespace')
      ),
      'expected "unregistered namespace" message for x_example.something and x_test.org forms'
    )
  })

  it('warns for single-label unregistered namespace without dot (x_somedomain#fragment)', function () {
    const result = recommendedTest_6_2_35({
      document: {
        distribution: { tlp: { label: 'CLEAR' } },
      },
      vulnerabilities: [
        {
          metrics: [
            {
              content: {
                ssvc_v2: {
                  selections: [{ namespace: 'x_somedomain#fragment' }],
                },
              },
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 1)
    assert.ok(
      result.warnings[0].message.includes('unregistered namespace'),
      'expected "unregistered namespace" message for x_somedomain#fragment'
    )
  })

  it('warns for fragment-free unregistered namespace (x_com.example)', function () {
    const result = recommendedTest_6_2_35({
      document: {
        distribution: { tlp: { label: 'CLEAR' } },
      },
      vulnerabilities: [
        {
          metrics: [
            {
              content: {
                ssvc_v2: {
                  selections: [{ namespace: 'x_com.example' }],
                },
              },
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 1)
    assert.ok(
      result.warnings[0].message.includes('unregistered namespace'),
      'expected "unregistered namespace" message for x_com.example (no fragment)'
    )
  })
})
