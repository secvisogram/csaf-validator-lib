import optionalTest_6_2_3 from '../lib/optionalTests/optionalTest_6_2_3.js'

describe('Optional test 6.2.3', function () {
  it('only runs on relevant documents', function () {
    expect(
      optionalTest_6_2_3({ vulnerabilities: 'mydoc' }).warnings
    ).to.deep.equal([])
    expect(
      optionalTest_6_2_3({
        vulnerabilities: [
          {
            product_status: { known_affected: ['CSAFPID-0001'] },
            scores: [{ products: [42] }],
          },
        ],
      }).warnings
    ).to.deep.equal([])
  })

  it('does not report products which are not affected', function () {
    expect(
      optionalTest_6_2_3({
        vulnerabilities: [
          {
            product_status: {
              fixed: ['CSAFPID-0001', 'CSAFPID-0002'],
              known_not_affected: ['CSAFPID-0003'],
            },
            scores: [{ products: ['CSAFPID-0001'] }],
          },
          {
            product_status: { first_affected: [] },
            scores: [{ products: ['CSAFPID-0001'] }],
          },
        ],
      }).warnings
    ).to.deep.equal([])
  })

  it('reports each affected product without a score in document order', function () {
    const result = optionalTest_6_2_3({
      vulnerabilities: [
        {
          product_status: {
            last_affected: ['CSAFPID-0003'],
            first_affected: ['CSAFPID-0001', 'CSAFPID-0002'],
            known_affected: ['CSAFPID-0002', 'CSAFPID-0001'],
          },
          scores: [
            { products: ['CSAFPID-0004'] },
            { products: ['CSAFPID-0003', 'CSAFPID-0001'] },
          ],
        },
        {
          product_status: { known_affected: ['CSAFPID-0001'] },
        },
        {
          product_status: { known_affected: ['CSAFPID-0002'] },
          scores: [{}, { products: ['CSAFPID-0002'] }],
        },
      ],
    })

    expect(result.warnings).to.deep.equal([
      {
        message: 'missing score',
        instancePath: '/vulnerabilities/0/product_status/first_affected/1',
      },
      {
        message: 'missing score',
        instancePath: '/vulnerabilities/0/product_status/known_affected/0',
      },
      {
        message: 'missing score',
        instancePath: '/vulnerabilities/1/product_status/known_affected/0',
      },
    ])
  })
})
