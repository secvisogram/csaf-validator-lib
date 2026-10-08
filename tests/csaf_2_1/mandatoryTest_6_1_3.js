import { mandatoryTest_6_1_3 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_3.js'

describe('mandatoryTest_6_1_3 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_3({ document: 'mydoc' }).isValid).to.equal(true)
  })

  it('returns valid when product_paths is not an array', function () {
    const doc = mandatoryTest_6_1_3({
      document: 'mydoc',
      product_tree: {
        product_paths: 'not_an_array',
      },
    })
    expect(doc.isValid).to.equal(true)
    expect(doc.errors.length).to.equal(0)
  })

  it('detects a circular definition across product paths', function () {
    const doc = mandatoryTest_6_1_3({
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'A',
            full_product_name: {
              name: 'B',
              product_id: 'B',
            },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'C',
              },
            ],
          },
          {
            beginning_product_reference: 'B',
            full_product_name: {
              name: 'C',
              product_id: 'C',
            },
            subpaths: [
              {
                category: 'installed_with',
                next_product_reference: 'D',
              },
            ],
          },
        ],
      },
    })

    expect(doc.isValid).to.equal(false)
    expect(doc.errors.length).to.equal(1)
    expect(doc.errors[0].instancePath).to.equal(
      '/product_tree/product_paths/1/full_product_name/product_id'
    )
  })

  it('returns valid when beginning_product_reference or product_id is missing', function () {
    const doc = mandatoryTest_6_1_3({
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: '',
            full_product_name: {
              name: 'A',
              product_id: 'A',
            },
            subpaths: [],
          },
          {
            beginning_product_reference: 'A',
            full_product_name: {
              name: 'B',
              product_id: '',
            },
            subpaths: [],
          },
        ],
      },
    })
    expect(doc.isValid).to.equal(true)
    expect(doc.errors.length).to.equal(0)
  })

  it('returns valid when two paths share a common dependency', function () {
    const doc = mandatoryTest_6_1_3({
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'A',
            full_product_name: { name: 'B', product_id: 'B' },
            subpaths: [],
          },
          {
            beginning_product_reference: 'A',
            full_product_name: { name: 'C', product_id: 'C' },
            subpaths: [],
          },
        ],
      },
    })
    expect(doc.isValid).to.equal(true)
    expect(doc.errors.length).to.equal(0)
  })

  it('does not report duplicate edges as circular (same target in beginning_product_reference and subpath)', function () {
    const doc = mandatoryTest_6_1_3({
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'A',
            full_product_name: { name: 'B', product_id: 'B' },
            subpaths: [
              {
                category: 'installed_on',
                next_product_reference: 'A',
              },
            ],
          },
        ],
      },
    })
    expect(doc.isValid).to.equal(true)
    expect(doc.errors.length).to.equal(0)
  })
})
