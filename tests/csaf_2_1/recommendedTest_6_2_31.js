import assert from 'node:assert'
import { recommendedTest_6_2_31 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_31', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_31({ product_tree: 'mydoc' }).warnings.length,
      0
    )
  })

  it('test input schema without branches', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          full_product_names: [
            {
              name: 'Example Company Controller A 1.0',
              product_id: 'CSAFPID-908070601',
              product_identification_helper: {
                serial_numbers: ['143-D-354'],
              },
            },
          ],
        },
      }).warnings.length,
      1
    )
  })

  it('test input schema without full_product_names', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          full_product_names: [],
          branches: [
            {
              category: 'product_version',
              name: '1.0',
              product: {
                name: 'Example Company Controller A 1.0',
                product_id: 'CSAFPID-908070601',
                product_identification_helper: {
                  serial_numbers: ['143-D-354'],
                },
              },
            },
          ],
        },
      }).warnings.length,
      1
    )
  })

  it('test product_path with no subpaths does not count as valid reference', function () {
    assert.equal(
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
      }).warnings.length,
      1
    )
  })

  it('skips invalid branches and processes valid ones', function () {
    assert.equal(
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
      }).warnings.length,
      1
    )
  })

  // it('skips branch product without product_id', function () {
  //   const result = recommendedTest_6_2_31({
  //     document: {},
  //     product_tree: {
  //       branches: [
  //         {
  //           product: {
  //             product_identification_helper: {
  //               serial_numbers: ['143-D-354'],
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   })
  //   assert.equal(result.warnings.length, 0)
  // })

  it('skips full_product_names entry without product_id', function () {
    const result = recommendedTest_6_2_31({
      document: {},
      product_tree: {
        full_product_names: [
          {
            product_identification_helper: {
              serial_numbers: ['143-D-354'],
            },
          },
        ],
      },
    })
    assert.equal(result.warnings.length, 0)
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
    assert.equal(result.warnings.length, 1)
    assert.equal(
      result.warnings[0].instancePath,
      '/product_tree/product_paths/0/full_product_name'
    )
  })

  it('no warning when product_paths full_product_name has empty serial and model numbers', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          product_paths: [
            {
              beginning_product_reference: 'CSAFPID-908070601',
              subpaths: [{ next_product_reference: 'CSAFPID-908070602' }],
              full_product_name: {
                product_id: 'CSAFPID-908070603',
                product_identification_helper: {
                  serial_numbers: [],
                  model_numbers: [],
                },
              },
            },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('no warning when product is referenced as next_product_reference in a subpath', function () {
    assert.equal(
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
      }).warnings.length,
      0
    )
  })
})
