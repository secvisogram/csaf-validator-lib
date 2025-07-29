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
})
