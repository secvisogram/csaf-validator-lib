import assert from 'node:assert/strict'
import {
  isValidSerialNumber,
  mandatoryTest_6_1_44,
} from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_44.js'

describe('mandatoryTest_6_1_44', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_44({ document: 'mydoc' }).isValid, true)
  })

  describe('isValidSerialNumber', function () {
    /*
      A list of test cases to validate against the function. The `string` is the
      serial number to check and the `boolean` marks if the serial number is expected 
      to be valid or invalid.
      
      - `true` means the serial number is expected to be VALID (no multiple unescaped stars)
      - `false` means the serial number is expected to be INVALID (contains multiple unescaped stars)
    */
    const testCases = /** @type {Array<[string, boolean]>} */ ([
      // Valid cases - single or no unescaped stars
      ['PA*', true],
      ['P?A*', true],
      ['P??A*', true],
      ['P???A*', true],
      ['P????A*', true],
      ['*PA', true],
      ['PA', true],
      ['*P\\*\\*?\\*', true],
      ['\\*PA*', true],
      ['PA\\*', true],
      ['PA\\**', true],
      ['*\\*', true],
      ['\\**', true],
      ['\\*\\*', true],
      
      // Invalid cases - multiple unescaped stars
      ['P*A*', false],
      ['*P*A', false],
      ['*P*\\*?*', false],
      ['**', false],
      ['***', false],
      ['*\\**', false],
      ['\\**\\*', false],
      ['*P*', false],
      ['P*A*B', false],
      ['P*A*B*', false]
    ])

    testCases.forEach((testCase) => {
      it(`${testCase[0]} -> ${testCase[1]}`, () => {
        assert.equal(isValidSerialNumber(testCase[0]), testCase[1])
      })
    })
  })

  describe('document validation', function () {
    it('detects multiple unescaped stars in full_product_names', function () {
      const doc = {
        product_tree: {
          full_product_names: [
            {
              name: 'Product A',
              product_id: 'CSAFPID-9080700',
              product_identification_helper: {
                serial_numbers: ['P*A*']
              }
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_44(doc)
      assert.equal(result.isValid, false)
      assert.equal(result.errors.length, 1)
      assert.equal(
        result.errors[0].instancePath,
        '/product_tree/full_product_names/0/product_identification_helper/serial_numbers/0'
      )
      assert.equal(
        result.errors[0].message,
        'serial number contains multiple unescaped stars'
      )
    })

    it('detects multiple unescaped stars in relationships', function () {
      const doc = {
        product_tree: {
          relationships: [
            {
              full_product_name: {
                name: 'Product A',
                product_id: 'CSAFPID-9080700',
                product_identification_helper: {
                  serial_numbers: ['P*A*']
                }
              },
              product_reference: 'CSAFPID-9080700',
              relates_to_product_reference: 'CSAFPID-9080701',
              category: 'default_component_of'
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_44(doc)
      assert.equal(result.isValid, false)
      assert.equal(result.errors.length, 1)
      assert.equal(
        result.errors[0].instancePath,
        '/product_tree/relationships/0/full_product_name/product_identification_helper/serial_numbers/0'
      )
      assert.equal(
        result.errors[0].message,
        'serial number contains multiple unescaped stars'
      )
    })

    it('detects multiple unescaped stars in branches', function () {
      const doc = {
        product_tree: {
          branches: [
            {
              category: 'product_name',
              name: 'Product A',
              product: {
                name: 'Product A',
                product_id: 'CSAFPID-9080700',
                product_identification_helper: {
                  serial_numbers: ['P*A*']
                }
              }
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_44(doc)
      assert.equal(result.isValid, false)
      assert.equal(result.errors.length, 1)
      assert.equal(
        result.errors[0].instancePath,
        '/product_tree/branches/0/product/product_identification_helper/serial_numbers/0'
      )
      assert.equal(
        result.errors[0].message,
        'serial number contains multiple unescaped stars'
      )
    })

    it('detects multiple unescaped stars in nested branches', function () {
      const doc = {
        product_tree: {
          branches: [
            {
              category: 'product_name',
              name: 'Product A',
              branches: [
                {
                  category: 'product_version',
                  name: '1.0',
                  product: {
                    name: 'Product A 1.0',
                    product_id: 'CSAFPID-9080700',
                    product_identification_helper: {
                      serial_numbers: ['P*A*']
                    }
                  }
                }
              ]
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_44(doc)
      assert.equal(result.isValid, false)
      assert.equal(result.errors.length, 1)
      assert.equal(
        result.errors[0].instancePath,
        '/product_tree/branches/0/branches/0/product/product_identification_helper/serial_numbers/0'
      )
      assert.equal(
        result.errors[0].message,
        'serial number contains multiple unescaped stars'
      )
    })

    it('passes valid serial numbers', function () {
      const doc = {
        product_tree: {
          full_product_names: [
            {
              name: 'Product A',
              product_id: 'CSAFPID-9080700',
              product_identification_helper: {
                serial_numbers: ['PA*', 'P?A*', '*P\\*\\*?\\*']
              }
            }
          ],
          relationships: [
            {
              full_product_name: {
                name: 'Product B',
                product_id: 'CSAFPID-9080701',
                product_identification_helper: {
                  serial_numbers: ['PB*', '\\*PB']
                }
              },
              product_reference: 'CSAFPID-9080700',
              relates_to_product_reference: 'CSAFPID-9080701',
              category: 'default_component_of'
            }
          ],
          branches: [
            {
              category: 'product_name',
              name: 'Product C',
              product: {
                name: 'Product C',
                product_id: 'CSAFPID-9080702',
                product_identification_helper: {
                  serial_numbers: ['PC*', '\\*PC\\*']
                }
              },
              branches: [
                {
                  category: 'product_version',
                  name: '1.0',
                  product: {
                    name: 'Product C 1.0',
                    product_id: 'CSAFPID-9080703',
                    product_identification_helper: {
                      serial_numbers: ['PC10*', '*']
                    }
                  }
                }
              ]
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_44(doc)
      assert.equal(result.isValid, true)
      assert.equal(result.errors.length, 0)
    })
  })
})
