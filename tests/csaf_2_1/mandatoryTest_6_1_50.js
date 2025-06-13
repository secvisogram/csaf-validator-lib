import { mandatoryTest_6_1_50, isValidProductVersionRangeName } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_50.js'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe('mandatoryTest_6_1_50', () => {
  describe('isValidProductVersionRangeName', () => {
    it('should validate valid vers specifications', () => {
      const validNames = [
        'vers:gem/>=2.2.0|!=2.2.1|<2.3.0',
        'vers:npm/1.2.3|>=2.0.0|<5.0.0',
        'vers:pypi/0.0.0|0.0.1|0.0.2|0.0.3|1.0|2.0pre1',
        'vers:tomee/>=8.0.0-M1|<=8.0.1',
        'vers:all/*'
      ]
      
      for (const name of validNames) {
        const result = isValidProductVersionRangeName(name)
        assert.equal(result.isValid, true, `Expected '${name}' to be valid`)
      }
    })
    
    it('should invalidate incorrect vers specifications', () => {
      const invalidNames = [
        'vers:/',
        'vers:gem',
        'vers:/>=2.2.0',
        'vers:gem/',
      ]
      
      for (const name of invalidNames) {
        const result = isValidProductVersionRangeName(name)
        assert.equal(result.isValid, false, `Expected '${name}' to be invalid`)
      }
    })
    
    it('should validate valid vers-like specifications', () => {
      const validNames = [
        '<=2',
        '<4.2',
        '<V3.0.29',
        '>=8.1.5',
        '>10.9a|!=10.9c|!=10.9f|<=10.9k',
        '<2024-4-pabc0019|>2024-10-pefd0010|<2024-12-pjkl2010|>2024-12-pjkl5010|<=2025-1-pghi1001'
      ]
      
      for (const name of validNames) {
        const result = isValidProductVersionRangeName(name)
        assert.equal(result.isValid, true, `Expected '${name}' to be valid`)
      }
    })
    
    it('should invalidate incorrect vers-like specifications', () => {
      const invalidNames = [
        'all versions < 4.2.0', // Example from the test description
        'version 3',
        'latest',
        'any'
      ]
      
      for (const name of invalidNames) {
        const result = isValidProductVersionRangeName(name)
        assert.equal(result.isValid, false, `Expected '${name}' to be invalid`)
      }
    })
  })
  
  describe('mandatoryTest_6_1_50', () => {
    it('should pass for valid product version range names', () => {
      const doc = {
        product_tree: {
          branches: [
            {
              category: 'product_version_range',
              name: 'vers:gem/>=2.2.0|!=2.2.1|<2.3.0',
              product: {
                name: 'Product A',
                product_id: 'CSAFPID-0001'
              }
            },
            {
              category: 'vendor',
              name: 'Vendor X',
              branches: [
                {
                  category: 'product_version_range',
                  name: '<=2',
                  product: {
                    name: 'Product B',
                    product_id: 'CSAFPID-0002'
                  }
                }
              ]
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_50(doc)
      assert.equal(result.isValid, true, 'Expected test to pass for valid product version range names')
      assert.equal(result.errors.length, 0, 'Expected no errors')
    })
    
    it('should fail for invalid product version range names', () => {
      const doc = {
        product_tree: {
          branches: [
            {
              category: 'product_version_range',
              name: 'all versions < 4.2.0', // Invalid format from the example
              product: {
                name: 'Product A',
                product_id: 'CSAFPID-0001'
              }
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_50(doc)
      assert.equal(result.isValid, false, 'Expected test to fail for invalid product version range names')
      assert.equal(result.errors.length, 1, 'Expected one error')
      assert.equal(result.errors[0].instancePath, '/product_tree/branches/0/name', 'Expected error at correct path')
    })
    
    it('should handle nested branches correctly', () => {
      const doc = {
        product_tree: {
          branches: [
            {
              category: 'vendor',
              name: 'Vendor X',
              branches: [
                {
                  category: 'product_name',
                  name: 'Product A',
                  branches: [
                    {
                      category: 'product_version_range',
                      name: 'invalid name without operators', // Invalid
                      product: {
                        name: 'Product A',
                        product_id: 'CSAFPID-0001'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_50(doc)
      assert.equal(result.isValid, false, 'Expected test to fail for invalid nested product version range names')
      assert.equal(result.errors.length, 1, 'Expected one error')
      assert.equal(result.errors[0].instancePath, '/product_tree/branches/0/branches/0/branches/0/name', 'Expected error at correct path')
    })
    
    it('should handle documents without product_tree', () => {
      const doc = {
        document: {
          title: 'Test Document',
          category: 'Test Category'
        }
      }
      
      const result = mandatoryTest_6_1_50(doc)
      assert.equal(result.isValid, true, 'Expected test to pass for documents without product_tree')
      assert.equal(result.errors.length, 0, 'Expected no errors')
    })
    
    it('should handle documents without branches', () => {
      const doc = {
        product_tree: {
          full_product_names: [
            {
              name: 'Product A',
              product_id: 'CSAFPID-0001'
            }
          ]
        }
      }
      
      const result = mandatoryTest_6_1_50(doc)
      assert.equal(result.isValid, true, 'Expected test to pass for documents without branches')
      assert.equal(result.errors.length, 0, 'Expected no errors')
    })
  })
})
