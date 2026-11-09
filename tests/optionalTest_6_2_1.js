import optionalTest_6_2_1 from '../lib/optionalTests/optionalTest_6_2_1.js'

describe('Optional test 6.2.1', function () {
  it('only runs on relevant documents', function () {
    expect(
      optionalTest_6_2_1({ product_tree: 'mydoc' }).warnings
    ).to.deep.equal([])
  })

  it('skips informational advisories', function () {
    const result = optionalTest_6_2_1({
      document: { category: 'csaf_informational_advisory' },
      product_tree: {
        full_product_names: [{ product_id: 'CSAFPID-0001', name: 'A' }],
      },
    })

    expect(result.warnings).to.deep.equal([])
  })

  it('reports unreferenced product ids in document order', function () {
    const result = optionalTest_6_2_1({
      product_tree: {
        branches: [
          {
            branches: [
              { product: { product_id: 'CSAFPID-0001', name: 'A' } },
              { product: { product_id: 'CSAFPID-0002', name: 'B' } },
            ],
          },
        ],
        full_product_names: [
          { product_id: 'CSAFPID-0003', name: 'C' },
          { product_id: 'CSAFPID-0002', name: 'B' },
        ],
        relationships: [
          {
            product_reference: 'CSAFPID-0001',
            relates_to_product_reference: 'CSAFPID-0003',
            full_product_name: { product_id: 'CSAFPID-0004', name: 'D' },
          },
        ],
      },
    })

    expect(result.warnings).to.deep.equal([
      {
        instancePath: '/product_tree/branches/0/branches/1/product/product_id',
        message: 'is not referenced',
      },
      {
        instancePath: '/product_tree/full_product_names/1/product_id',
        message: 'is not referenced',
      },
      {
        instancePath:
          '/product_tree/relationships/0/full_product_name/product_id',
        message: 'is not referenced',
      },
    ])
  })

  it('accepts references from every supported location', function () {
    /** @type {Array<any>} */
    const referencingDocs = [
      { product_tree: { product_groups: [{ product_ids: ['CSAFPID-0001'] }] } },
      {
        product_tree: {
          relationships: [{ relates_to_product_reference: 'CSAFPID-0001' }],
        },
      },
      ...[
        'first_affected',
        'first_fixed',
        'fixed',
        'known_affected',
        'known_not_affected',
        'last_affected',
        'recommended',
        'under_investigation',
      ].map((key) => ({
        vulnerabilities: [{ product_status: { [key]: ['CSAFPID-0001'] } }],
      })),
      {
        vulnerabilities: [
          { remediations: [{ product_ids: ['CSAFPID-0001'] }] },
        ],
      },
      { vulnerabilities: [{ scores: [{ products: ['CSAFPID-0001'] }] }] },
      { vulnerabilities: [{ threats: [{ product_ids: ['CSAFPID-0001'] }] }] },
    ]

    for (const referencingDoc of referencingDocs) {
      const result = optionalTest_6_2_1({
        ...referencingDoc,
        product_tree: {
          ...referencingDoc.product_tree,
          full_product_names: [{ product_id: 'CSAFPID-0001', name: 'A' }],
        },
      })

      expect(result.warnings).to.deep.equal([])
    }
  })

  it('ignores a location which does not have the expected shape', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          { product_id: 'CSAFPID-0001', name: 'A' },
          { product_id: 'CSAFPID-0002', name: 'B' },
        ],
        product_groups: [
          { product_ids: ['CSAFPID-0001'] },
          { product_ids: [42] },
        ],
      },
      vulnerabilities: [{ scores: [{ products: ['CSAFPID-0002'] }] }],
    }

    expect(optionalTest_6_2_1(doc).warnings).to.deep.equal([
      {
        instancePath: '/product_tree/full_product_names/0/product_id',
        message: 'is not referenced',
      },
    ])
  })
})
