import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    product_tree: {
      additionalProperties: true,

      optionalProperties: {
        branches: {
          elements: {
            additionalProperties: true,

            properties: {},
          },
        },

        full_product_names: {
          elements: {
            additionalProperties: true,

            properties: {},
          },
        },

        relationships: {
          elements: {
            additionalProperties: true,

            properties: {},
          },
        },
      },
    },
  },

  optionalProperties: {
    document: {
      additionalProperties: true,

      optionalProperties: {
        category: { type: 'string' },
      },
    },
  },
})
const validate = ajv.compile(inputSchema)

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    product_id: { type: 'string' },
  },
})
const validateFullProductName = ajv.compile(fullProductNameSchema)

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product: fullProductNameSchema,
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})
const validateBranch = ajv.compile(branchSchema)

const relationshipSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    full_product_name: fullProductNameSchema,
  },
})
const validateRelationship = ajv.compile(relationshipSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_1(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (
    !validate(doc) ||
    doc.document?.category === 'csaf_informational_advisory'
  ) {
    return context
  }

  const isReferenced = createIsReferenced(doc)

  /**
   * @param {object} params
   * @param {string} params.path
   * @param {unknown[]} params.branches
   */
  function checkBranches({ path, branches }) {
    branches.forEach((branch, branchIndex) => {
      if (validateBranch(branch)) {
        if (
          typeof branch.product?.product_id === 'string' &&
          !isReferenced(branch.product.product_id)
        ) {
          warnings.push({
            instancePath: `${path}/${branchIndex}/product/product_id`,
            message: 'is not referenced',
          })
        }

        if (Array.isArray(branch.branches)) {
          checkBranches({
            path: `${path}/${branchIndex}/branches`,
            branches: branch.branches,
          })
        }
      }
    })
  }

  checkBranches({
    path: '/product_tree/branches',
    branches: doc.product_tree?.branches ?? [],
  })

  doc.product_tree.full_product_names?.forEach(
    (fullProductName, fullProductNameIndex) => {
      if (!validateFullProductName(fullProductName)) return
      if (!isReferenced(fullProductName.product_id)) {
        context.warnings.push({
          instancePath: `/product_tree/full_product_names/${fullProductNameIndex}/product_id`,
          message: 'is not referenced',
        })
      }
    }
  )

  doc.product_tree.relationships?.forEach((relationship, relationshipIndex) => {
    if (!validateRelationship(relationship)) return
    if (!isReferenced(relationship.full_product_name.product_id)) {
      context.warnings.push({
        instancePath: `/product_tree/relationships/${relationshipIndex}/full_product_name/product_id`,
        message: 'is not referenced',
      })
    }
  })

  return context
}

const containsProductGroupsSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    product_tree: {
      additionalProperties: true,

      properties: {
        product_groups: {
          elements: {
            additionalProperties: true,

            optionalProperties: {
              product_ids: {
                elements: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const containsRelationshipWithReferencesSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    product_tree: {
      additionalProperties: true,

      properties: {
        relationships: {
          elements: {
            additionalProperties: true,

            optionalProperties: {
              product_reference: { type: 'string' },
              relates_to_product_reference: { type: 'string' },
            },
          },
        },
      },
    },
  },
})

const containsVulnerabilitiesWithReferencesSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,

        optionalProperties: {
          product_status: {
            additionalProperties: true,

            optionalProperties: {
              first_affected: { elements: { type: 'string' } },
              first_fixed: { elements: { type: 'string' } },
              fixed: { elements: { type: 'string' } },
              known_affected: { elements: { type: 'string' } },
              known_not_affected: { elements: { type: 'string' } },
              last_affected: { elements: { type: 'string' } },
              recommended: { elements: { type: 'string' } },
              under_investigation: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
  },
})

const containsVulnerabilitiesWithOptionalReferencesSchema =
  /** @type {const} */ ({
    additionalProperties: true,

    properties: {
      vulnerabilities: {
        elements: {
          additionalProperties: true,

          optionalProperties: {
            remediations: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  product_ids: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
            scores: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  products: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
            threats: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  product_ids: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

const validateContainsProductGroups = ajv.compile(containsProductGroupsSchema)
const validateContainsRelationshipWithReferences = ajv.compile(
  containsRelationshipWithReferencesSchema
)
const validateContainsVulnerabilitiesWithReferences = ajv.compile(
  containsVulnerabilitiesWithReferencesSchema
)
const validateContainsVulnerabilitiesWithOptionalReferences = ajv.compile(
  containsVulnerabilitiesWithOptionalReferencesSchema
)

/**
 * Returns a function which tells whether a product id is referenced in the
 * given document. The reference locations are checked in a fixed order
 * (product groups, relationships, product status, then remediations, scores
 * and threats), and a later one only if the product id was not found in an
 * earlier one. The product ids of a location are collected into a Set the
 * first time the location is needed, so that the document is traversed at
 * most once per location instead of once per product id.
 *
 * @param {unknown} doc
 * @returns {(productId: string) => boolean}
 */
function createIsReferenced(doc) {
  const collectors = [
    collectProductGroupReferences,
    collectRelationshipReferences,
    collectProductStatusReferences,
    collectOptionalVulnerabilityReferences,
  ]
  /** @type {Array<Set<string>>} */
  const referencedProductIds = []

  return (productId) =>
    collectors.some((collect, index) => {
      referencedProductIds[index] ??= collect(doc)
      return referencedProductIds[index].has(productId)
    })
}

/**
 * @param {unknown} doc
 * @returns {Set<string>}
 */
function collectProductGroupReferences(doc) {
  /** @type {Set<string>} */
  const productIds = new Set()
  if (validateContainsProductGroups(doc)) {
    doc.product_tree.product_groups.forEach((group) => {
      group.product_ids?.forEach((productId) => productIds.add(productId))
    })
  }
  return productIds
}

/**
 * @param {unknown} doc
 * @returns {Set<string>}
 */
function collectRelationshipReferences(doc) {
  /** @type {Set<string>} */
  const productIds = new Set()
  if (validateContainsRelationshipWithReferences(doc)) {
    doc.product_tree.relationships.forEach((relationship) => {
      if (relationship.product_reference !== undefined) {
        productIds.add(relationship.product_reference)
      }
      if (relationship.relates_to_product_reference !== undefined) {
        productIds.add(relationship.relates_to_product_reference)
      }
    })
  }
  return productIds
}

/**
 * @param {unknown} doc
 * @returns {Set<string>}
 */
function collectProductStatusReferences(doc) {
  /** @type {Set<string>} */
  const productIds = new Set()
  if (validateContainsVulnerabilitiesWithReferences(doc)) {
    doc.vulnerabilities.forEach((vulnerability) => {
      const keys = /** @type {const} */ ([
        'first_affected',
        'first_fixed',
        'fixed',
        'known_affected',
        'known_not_affected',
        'last_affected',
        'recommended',
        'under_investigation',
      ])
      keys.forEach((key) => {
        vulnerability.product_status?.[key]?.forEach((productId) =>
          productIds.add(productId)
        )
      })
    })
  }
  return productIds
}

/**
 * @param {unknown} doc
 * @returns {Set<string>}
 */
function collectOptionalVulnerabilityReferences(doc) {
  /** @type {Set<string>} */
  const productIds = new Set()
  if (validateContainsVulnerabilitiesWithOptionalReferences(doc)) {
    doc.vulnerabilities.forEach((vulnerability) => {
      vulnerability.remediations?.forEach((remediation) => {
        remediation.product_ids?.forEach((productId) =>
          productIds.add(productId)
        )
      })
      vulnerability.scores?.forEach((score) => {
        score.products?.forEach((productId) => productIds.add(productId))
      })
      vulnerability.threats?.forEach((threat) => {
        threat.product_ids?.forEach((productId) => productIds.add(productId))
      })
    })
  }
  return productIds
}
