import Ajv from 'ajv/dist/jtd.js'

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

        product_paths: {
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

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    full_product_name: fullProductNameSchema,
  },
})
const validateProductPath = ajv.compile(productPathSchema)

/**
 * @param {any} doc
 */
export function recommendedTest_6_2_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (
    !validate(doc) ||
    doc.document?.category === 'csaf_informational_advisory'
  ) {
    return ctx
  }

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
          !isReferenced(doc, branch.product.product_id)
        ) {
          ctx.warnings.push({
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
      if (!isReferenced(doc, fullProductName.product_id)) {
        ctx.warnings.push({
          instancePath: `/product_tree/full_product_names/${fullProductNameIndex}/product_id`,
          message: 'is not referenced',
        })
      }
    }
  )

  doc.product_tree.product_paths?.forEach((productPath, productPathIndex) => {
    if (!validateProductPath(productPath)) return
    if (!isReferenced(doc, productPath.full_product_name.product_id)) {
      ctx.warnings.push({
        instancePath: `/product_tree/product_paths/${productPathIndex}/full_product_name/product_id`,
        message: 'is not referenced',
      })
    }
  })

  return ctx
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

const containsProductPathsWithReferencesSchema = /** @type {const} */ ({
  additionalProperties: true,

  properties: {
    product_tree: {
      additionalProperties: true,

      properties: {
        product_paths: {
          elements: {
            additionalProperties: true,

            optionalProperties: {
              beginning_product_reference: { type: 'string' },
              subpaths: {
                elements: {
                  additionalProperties: true,
                  optionalProperties: {
                    next_product_reference: { type: 'string' },
                  },
                },
              },
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
              unknown: { elements: { type: 'string' } },
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
            metrics: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  products: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
            flags: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  product_ids: {
                    elements: { type: 'string' },
                  },
                },
              },
            },
            first_known_exploitation_dates: {
              elements: {
                additionalProperties: true,

                optionalProperties: {
                  product_ids: {
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
const validateContainsProductPathsWithReferences = ajv.compile(
  containsProductPathsWithReferencesSchema
)
const validateContainsVulnerabilitiesWithReferences = ajv.compile(
  containsVulnerabilitiesWithReferencesSchema
)
const validateContainsVulnerabilitiesWithOptionalReferences = ajv.compile(
  containsVulnerabilitiesWithOptionalReferencesSchema
)

/**
 * @param {unknown} doc
 * @param {string} productId
 */
function isReferenced(doc, productId) {
  let referenced = false

  if (!referenced && validateContainsProductGroups(doc)) {
    referenced = doc.product_tree.product_groups.some((group) => {
      return group.product_ids?.includes(productId) ?? false
    })
  }

  if (!referenced && validateContainsProductPathsWithReferences(doc)) {
    referenced = doc.product_tree.product_paths.some((productPath) => {
      return (
        productPath.beginning_product_reference === productId ||
        productPath.subpaths?.some(
          (subpath) => subpath.next_product_reference === productId
        )
      )
    })
  }

  if (!referenced && validateContainsVulnerabilitiesWithReferences(doc)) {
    referenced = doc.vulnerabilities.some((vulnerability) => {
      const keys = /** @type {const} */ ([
        'first_affected',
        'first_fixed',
        'fixed',
        'known_affected',
        'known_not_affected',
        'last_affected',
        'recommended',
        'under_investigation',
        'unknown',
      ])
      return keys.some(
        (key) =>
          vulnerability.product_status?.[key]?.includes(productId) ?? false
      )
    })
  }

  if (
    !referenced &&
    validateContainsVulnerabilitiesWithOptionalReferences(doc)
  ) {
    referenced = doc.vulnerabilities.some((vulnerability) => {
      return (
        vulnerability.remediations?.some((remediation) =>
          remediation.product_ids?.includes(productId)
        ) ||
        vulnerability.metrics?.some((metric) =>
          metric.products?.includes(productId)
        ) ||
        vulnerability.flags?.some((flag) =>
          flag.product_ids?.includes(productId)
        ) ||
        vulnerability.first_known_exploitation_dates?.some((entry) =>
          entry.product_ids?.includes(productId)
        ) ||
        vulnerability.threats?.some((threat) =>
          threat.product_ids?.includes(productId)
        ) ||
        false
      )
    })
  }

  return referenced
}
