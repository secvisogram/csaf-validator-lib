import { recommendedTest_6_2_31 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_31', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_31({ product_tree: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('does not count a product path without subpaths as a reference', function () {
    expect(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          full_product_names: [
            {
              product_id: 'CSAFPID-908070601',
              product_identification_helper: {
                serial_numbers: ['143-D-354'],
              },
            },
          ],
          product_paths: [
            {
              beginning_product_reference: 'CSAFPID-908070601',
              subpaths: [],
              full_product_name: {
                product_id: 'CSAFPID-908070603',
              },
            },
          ],
        },
      }).warnings.length
    ).to.equal(1)
  })

  it('skips invalid branches and processes valid ones', function () {
    expect(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          branches: [
            {
              branches: [
                {
                  product: 'invalid',
                },
                {
                  branches: [{}],
                },
                {
                  product: {
                    product_id: 'CSAFPID-908070602',
                    product_identification_helper: {
                      model_numbers: ['CA-1000'],
                    },
                  },
                },
              ],
            },
          ],
        },
      }).warnings.length
    ).to.equal(1)
  })

  it('ignores product path references that are missing', function () {
    const result = recommendedTest_6_2_31({
      document: {},
      product_tree: {
        full_product_names: [
          {
            product_id: 'CSAFPID-1',
            product_identification_helper: { serial_numbers: ['1'] },
          },
        ],
        product_paths: [
          {
            subpaths: [{}, { next_product_reference: 'CSAFPID-2' }],
            full_product_name: { product_id: 'CSAFPID-3' },
          },
        ],
      },
    })
    expect(result.warnings.map((w) => w.instancePath)).to.deep.equal([
      '/product_tree/full_product_names/0',
    ])
  })

  it('warns with correct instancePath for product_paths[*].full_product_name', function () {
    const result = recommendedTest_6_2_31({
      document: {},
      product_tree: {
        product_paths: [
          {
            beginning_product_reference: 'CSAFPID-908070601',
            subpaths: [{ next_product_reference: 'CSAFPID-908070602' }],
            full_product_name: {
              product_id: 'CSAFPID-908070603',
              product_identification_helper: {
                serial_numbers: ['143-D-354'],
              },
            },
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/product_paths/0/full_product_name'
    )
  })

  it('no warning when product is referenced as beginning_product_reference', function () {
    expect(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          full_product_names: [
            {
              product_id: 'CSAFPID-908070601',
              product_identification_helper: {
                model_numbers: ['CA-1000'],
              },
            },
          ],
          product_paths: [
            {
              beginning_product_reference: 'CSAFPID-908070601',
              subpaths: [{ next_product_reference: 'CSAFPID-908070602' }],
              full_product_name: {
                product_id: 'CSAFPID-908070603',
              },
            },
          ],
        },
      }).warnings.length
    ).to.equal(0)
  })
})
