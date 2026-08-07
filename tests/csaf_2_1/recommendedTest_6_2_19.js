import assert from 'node:assert'
import { recommendedTest_6_2_19 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_19', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_19({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('warns when cvss_v2 base metrics are missing', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v2: {
                  vectorString: '',
                },
              },
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 1)
  })

  it('warns when cvss_v3 vector is invalid', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v3: {
                  version: '3.1',
                  vectorString: 'INVALID_VECTOR',
                },
              },
            },
          ],
        },
      ],
    })
    // calculatedValue === null → checkCVSS returns true → warning is issued
    assert.equal(result.warnings.length, 1)
  })

  it('warns when cvss_v2 vectorString is undefined (missing)', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v2: {
                  // kein vectorString → wird zu '' durch ?? ''
                },
              },
            },
          ],
        },
      ],
    })
    // calculatedValue === null → checkCVSS gibt true → Warning
    assert.equal(result.warnings.length, 1)
  })

  it('does not warn when cvss_v3 environmental score is 0', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: { fixed: ['CSAFPID-0001'] },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v3: {
                  version: '3.1',
                  vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
                  environmentalScore: 0, // nicht > 0
                  // calculatedValue wird 0 sein → nicht > 0 und nicht null
                },
              },
            },
          ],
        },
      ],
    })
    assert.equal(result.warnings.length, 0)
  })
})
