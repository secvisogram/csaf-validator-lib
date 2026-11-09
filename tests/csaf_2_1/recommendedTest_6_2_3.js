import { recommendedTest_6_2_3 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_3', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_3({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('does not report products which are not affected', function () {
    expect(
      recommendedTest_6_2_3({
        vulnerabilities: [
          {
            product_status: {
              fixed: ['CSAFPID-0001', 'CSAFPID-0002'],
              known_not_affected: ['CSAFPID-0003'],
            },
            metrics: [{ products: ['CSAFPID-0001'] }],
          },
          {
            product_status: { first_affected: [] },
            metrics: [{ products: ['CSAFPID-0001'] }],
          },
        ],
      }).warnings
    ).to.deep.equal([])
  })

  it('reports each affected product without a metric in document order', function () {
    const result = recommendedTest_6_2_3({
      vulnerabilities: [
        {
          product_status: {
            first_affected: ['CSAFPID-0001', 'CSAFPID-0002'],
            known_affected: ['CSAFPID-0002'],
          },
          metrics: [{ products: ['CSAFPID-0003', 'CSAFPID-0001'] }],
        },
        {
          product_status: { last_affected: ['CSAFPID-0001'] },
          metrics: [{}],
        },
      ],
    })

    expect(result.warnings).to.deep.equal([
      {
        message: 'missing metric',
        instancePath: '/vulnerabilities/0/product_status/first_affected/1',
      },
      {
        message: 'missing metric',
        instancePath: '/vulnerabilities/0/product_status/known_affected/0',
      },
      {
        message: 'missing metric',
        instancePath: '/vulnerabilities/1/product_status/last_affected/0',
      },
    ])
  })
})
