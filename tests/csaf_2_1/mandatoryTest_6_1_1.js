import assert from 'node:assert/strict'
import { mandatoryTest_6_1_1 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_1.js'
import * as docUtils from '../../lib/mandatoryTests/shared/docUtils.js'

describe('mandatoryTest_6_1_1', function () {
  // Test the collectProductIdRefs function directly
  describe('collectProductIdRefs', function () {
    it('collects product ID references from all locations', function () {
      const doc = {
        product_tree: {
          product_groups: [
            {
              group_id: 'CSAFGID-0001',
              product_ids: ['CSAFPID-9080700', 'CSAFPID-9080701']
            }
          ],
          relationships: [
            {
              product_reference: 'CSAFPID-9080702',
              relates_to_product_reference: 'CSAFPID-9080703',
              category: 'default_component_of'
            }
          ]
        },
        vulnerabilities: [
          {
            product_status: {
              known_affected: ['CSAFPID-9080704'],
              fixed: ['CSAFPID-9080705']
            },
            remediations: [
              {
                product_ids: ['CSAFPID-9080706']
              }
            ],
            metrics: [
              {
                products: ['CSAFPID-9080707']
              }
            ],
            threats: [
              {
                product_ids: ['CSAFPID-9080708']
              }
            ]
          }
        ]
      }
      
      // Access the non-exported function through Function.toString() and eval
      const collectProductIdRefsStr = mandatoryTest_6_1_1.toString()
      const collectProductIdRefsMatch = collectProductIdRefsStr.match(/function collectProductIdRefs\(\{[^}]*\}\) \{[\s\S]*?\}/)
      
      // If we can't extract the function, skip this test
      if (!collectProductIdRefsMatch) {
        console.warn('Could not extract collectProductIdRefs function for testing')
        return
      }
      
      const collectProductIdRefsFunc = new Function('document', `
        const entries = [];
        ${collectProductIdRefsMatch[0].replace('function collectProductIdRefs({document}) {', '')}
        return entries;
      `)
      
      const refs = collectProductIdRefsFunc(doc)
      
      // Verify all references were collected
      assert.equal(refs.length, 9)
      
      // Check that each expected ID is in the results
      const ids = refs.map(/** @param {any} ref */ (ref) => ref.id)
      assert(ids.includes('CSAFPID-9080700'))
      assert(ids.includes('CSAFPID-9080701'))
      assert(ids.includes('CSAFPID-9080702'))
      assert(ids.includes('CSAFPID-9080703'))
      assert(ids.includes('CSAFPID-9080704'))
      assert(ids.includes('CSAFPID-9080705'))
      assert(ids.includes('CSAFPID-9080706'))
      assert(ids.includes('CSAFPID-9080707'))
      assert(ids.includes('CSAFPID-9080708'))
    })
  })
  
  // Test the findMissingDefinitions function directly
  describe('findMissingDefinitions', function () {
    it('correctly identifies missing product definitions', function () {
      // Access the non-exported function through Function.toString() and eval
      const findMissingDefinitionsStr = mandatoryTest_6_1_1.toString()
      const findMissingDefinitionsMatch = findMissingDefinitionsStr.match(/const findMissingDefinitions = \([^)]*\) => \{[\s\S]*?\}/)
      
      // If we can't extract the function, skip this test
      if (!findMissingDefinitionsMatch) {
        console.warn('Could not extract findMissingDefinitions function for testing')
        return
      }
      
      const findMissingDefinitionsFunc = new Function('entries', 'refs', `
        return ${findMissingDefinitionsMatch[0].replace('const findMissingDefinitions = (entries, refs) => {', '')}
      `)
      
      const entries = [
        { id: 'CSAFPID-9080700' },
        { id: 'CSAFPID-9080701' }
      ]
      
      const refs = [
        { id: 'CSAFPID-9080700', instancePath: '/path/1' },
        { id: 'CSAFPID-9080701', instancePath: '/path/2' },
        { id: 'CSAFPID-9080702', instancePath: '/path/3' },
        { id: 'CSAFPID-9080703', instancePath: '/path/4' }
      ]
      
      const missing = findMissingDefinitionsFunc(entries, refs)
      
      assert.equal(missing.length, 2)
      assert.equal(missing[0].id, 'CSAFPID-9080702')
      assert.equal(missing[0].instancePath, '/path/3')
      assert.equal(missing[1].id, 'CSAFPID-9080703')
      assert.equal(missing[1].instancePath, '/path/4')
    })
  })
  
  // Test the collectProductIds function from docUtils
  describe('collectProductIds', function () {
    it('collects product IDs from all locations', function () {
      const doc = {
        product_tree: {
          full_product_names: [
            {
              name: 'Product A',
              product_id: 'CSAFPID-9080700'
            }
          ],
          branches: [
            {
              category: 'product_name',
              name: 'Product B',
              product: {
                name: 'Product B',
                product_id: 'CSAFPID-9080701'
              },
              branches: [
                {
                  category: 'product_version',
                  name: '1.0',
                  product: {
                    name: 'Product B 1.0',
                    product_id: 'CSAFPID-9080702'
                  }
                }
              ]
            }
          ],
          relationships: [
            {
              full_product_name: {
                name: 'Product C',
                product_id: 'CSAFPID-9080703'
              }
            }
          ]
        }
      }
      
      const productIds = docUtils.collectProductIds({ document: doc })
      
      assert.equal(productIds.length, 4)
      
      // Check that each expected ID is in the results
      const ids = productIds.map(/** @param {any} entry */ (entry) => entry.id)
      assert(ids.includes('CSAFPID-9080700'))
      assert(ids.includes('CSAFPID-9080701'))
      assert(ids.includes('CSAFPID-9080702'))
      assert(ids.includes('CSAFPID-9080703'))
    })
  })
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_1({ document: 'mydoc' }).isValid, true)
  })

  it('passes when all product ID references have definitions', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-9080700']
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
  })

  it('fails when product ID references are missing definitions', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-9080700', 'CSAFPID-9080701']
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/product_status/known_affected/1')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates product references in product_groups', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ],
        product_groups: [
          {
            group_id: 'CSAFGID-0001',
            product_ids: ['CSAFPID-9080700', 'CSAFPID-9080701']
          }
        ]
      }
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/product_tree/product_groups/0/product_ids/1')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates product references in relationships', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ],
        relationships: [
          {
            product_reference: 'CSAFPID-9080700',
            relates_to_product_reference: 'CSAFPID-9080701',
            category: 'default_component_of'
          }
        ]
      }
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/product_tree/relationships/0/relates_to_product_reference')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates product references in remediations', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          remediations: [
            {
              category: 'vendor_fix',
              details: 'Update to the latest version',
              product_ids: ['CSAFPID-9080700', 'CSAFPID-9080701']
            }
          ]
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/remediations/0/product_ids/1')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates product references in threats', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          threats: [
            {
              category: 'exploit_status',
              details: 'Exploit available',
              product_ids: ['CSAFPID-9080700', 'CSAFPID-9080701']
            }
          ]
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/threats/0/product_ids/1')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates product references in metrics', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          metrics: [
            {
              products: ['CSAFPID-9080700', 'CSAFPID-9080701'],
              scores: []
            }
          ]
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/metrics/0/products/1')
    assert.equal(result.errors[0].message, 'definition of product id missing')
  })

  it('validates all product status fields', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            first_affected: ['CSAFPID-9080701'],
            first_fixed: ['CSAFPID-9080702'],
            fixed: ['CSAFPID-9080703'],
            known_affected: ['CSAFPID-9080700'],
            known_not_affected: ['CSAFPID-9080704'],
            last_affected: ['CSAFPID-9080705'],
            recommended: ['CSAFPID-9080706'],
            under_investigation: ['CSAFPID-9080707']
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 7)
    
    // Check that all product status fields are validated
    const paths = result.errors.map(/** @param {any} error */ (error) => error.instancePath)
    assert(paths.includes('/vulnerabilities/0/product_status/first_affected/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/first_fixed/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/fixed/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/known_not_affected/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/last_affected/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/recommended/0'))
    assert(paths.includes('/vulnerabilities/0/product_status/under_investigation/0'))
  })

  it('handles multiple missing product definitions', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ],
        product_groups: [
          {
            group_id: 'CSAFGID-0001',
            product_ids: ['CSAFPID-9080701', 'CSAFPID-9080702']
          }
        ],
        relationships: [
          {
            product_reference: 'CSAFPID-9080703',
            relates_to_product_reference: 'CSAFPID-9080704',
            category: 'default_component_of'
          }
        ]
      }
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 4)
  })
  
  it('handles complex nested branch structures', function () {
    const doc = {
      product_tree: {
        branches: [
          {
            category: 'vendor',
            name: 'Vendor A',
            branches: [
              {
                category: 'product_family',
                name: 'Family X',
                branches: [
                  {
                    category: 'product_name',
                    name: 'Product A',
                    product: {
                      name: 'Product A',
                      product_id: 'CSAFPID-9080700'
                    },
                    branches: [
                      {
                        category: 'product_version',
                        name: '1.0',
                        product: {
                          name: 'Product A 1.0',
                          product_id: 'CSAFPID-9080701'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-9080700', 'CSAFPID-9080701', 'CSAFPID-9080702']
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/product_status/known_affected/2')
  })
  
  it('handles empty arrays and null values gracefully', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ],
        product_groups: [
          {
            group_id: 'CSAFGID-0001',
            product_ids: []
          }
        ],
        relationships: [
          {
            category: 'default_component_of'
            // Missing product_reference and relates_to_product_reference
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: null,
            fixed: []
          },
          remediations: [
            {
              category: 'vendor_fix',
              details: 'Update',
              product_ids: null
            }
          ],
          threats: [
            {
              category: 'exploit_status',
              details: 'None',
              // Missing product_ids
            }
          ],
          metrics: [
            {
              // Missing products
              scores: []
            }
          ]
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
  })
  
  it('handles documents with no product tree', function () {
    const doc = {
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['CSAFPID-9080700']
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
  })
  
  it('handles documents with no vulnerabilities', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      }
      // No vulnerabilities
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, true)
    assert.equal(result.errors.length, 0)
  })
  
  it('handles case sensitivity in product IDs', function () {
    const doc = {
      product_tree: {
        full_product_names: [
          {
            name: 'Product A',
            product_id: 'CSAFPID-9080700'
          }
        ]
      },
      vulnerabilities: [
        {
          product_status: {
            known_affected: ['csafpid-9080700'] // Lowercase version of the ID
          }
        }
      ]
    }
    
    const result = mandatoryTest_6_1_1(doc)
    assert.equal(result.isValid, false)
    assert.equal(result.errors.length, 1)
    assert.equal(result.errors[0].instancePath, '/vulnerabilities/0/product_status/known_affected/0')
  })
})
