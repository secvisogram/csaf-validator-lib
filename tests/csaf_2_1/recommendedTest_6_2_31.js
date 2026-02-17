import assert from 'node:assert'
import { recommendedTest_6_2_31 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_31', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_31({ vulnerabilities: 'mydoc' }).warnings.length,
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

  it('test branches without serial_numbers or model_numbers', function () {
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

  it('test full_product_names without serial_numbers or model_numbers', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          full_product_names: [
            {
              name: 'Example Company Controller A 1.0',
              product_id: 'CSAFPID-908070601',
              product_identification_helper: {
                serial_numbers: [],
                model_numbers: [],
              },
            },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('test nested branches 5 levels deep', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          branches: [
            {
              category: 'vendor',
              name: 'Example Company',
              branches: [
                {
                  category: 'product_family',
                  name: 'Controller Series',
                  branches: [
                    {
                      category: 'product_name',
                      name: 'Controller A',
                      branches: [
                        {
                          category: 'product_version',
                          name: '1.0',
                          branches: [
                            {
                              category: 'architecture',
                              name: 'x86',
                              product: {
                                name: 'Example Company Controller A 1.0 x86',
                                product_id: 'CSAFPID-908070601',
                                product_identification_helper: {
                                  serial_numbers: ['143-D-354'],
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      }).warnings.length,
      1
    )
  })

  it('test relationship with the same ID for product_reference and relates_to_product_reference', function () {
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
            {
              name: 'Microsoft Windows',
              product_id: 'CSAFPID-908070602',
            },
          ],
          relationships: [
            {
              product_reference: 'CSAFPID-908070602',
              relates_to_product_reference: 'CSAFPID-908070602',
            },
          ],
        },
      }).warnings.length,
      1
    )
  })

  it('test relationship with product_reference only', function () {
    assert.equal(
      recommendedTest_6_2_31({
        document: {},
        product_tree: {
          branches: [
            {
              category: 'product_version',
              name: '1.0',
              product: {
                name: 'Example Company Controller A 1.0',
                product_id: 'CSAFPID-908070601',
                product_identification_helper: {
                  model_numbers: ['CA-1000'],
                },
              },
            },
          ],
          relationships: [
            {
              product_reference: 'CSAFPID-908070601',
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
              category: 'vendor',
              name: 'Example Company',
              product: {
                product_id: 'CSAFPID-908070601',
                product_identification_helper: {
                  serial_numbers: ['143-D-354'],
                },
              },
              branches: [
                {
                  product: 'invalid',
                },
                {
                  branches: [{}],
                },
                {
                  category: 'product_version',
                  name: '1.0',
                  product: {
                    name: 'Example Company Controller A 1.0',
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
      2
    )
  })
})
