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

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_id: { type: 'string' },
  },
})

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

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    full_product_name: fullProductNameSchema,
  },
})

const validate = ajv.compile(inputSchema)
const validateFullProductName = ajv.compile(fullProductNameSchema)
const validateBranch = ajv.compile(branchSchema)
const validateProductPath = ajv.compile(productPathSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productGroupsSchema>} ProductGroups
 */

/**
 * This implements the recommended test 6.2.1 of the CSAF 2.1 standard.
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

  const referencedProductIds = collectReferencedProductIds(doc)

  /**
   * @param {object} params
   * @param {string} params.path
   * @param {Branch[]} params.branches
   */
  function checkBranches({ path, branches }) {
    branches.forEach((branch, branchIndex) => {
      if (validateBranch(branch)) {
        if (
          typeof branch.product?.product_id === 'string' &&
          !referencedProductIds.has(branch.product.product_id)
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
      if (validateFullProductName(fullProductName)) {
        if (!referencedProductIds.has(fullProductName.product_id)) {
          ctx.warnings.push({
            instancePath: `/product_tree/full_product_names/${fullProductNameIndex}/product_id`,
            message: 'is not referenced',
          })
        }
      }
    }
  )

  doc.product_tree.product_paths?.forEach((productPath, productPathIndex) => {
    if (validateProductPath(productPath)) {
      if (!referencedProductIds.has(productPath.full_product_name.product_id)) {
        ctx.warnings.push({
          instancePath: `/product_tree/product_paths/${productPathIndex}/full_product_name/product_id`,
          message: 'is not referenced',
        })
      }
    }
  })

  return ctx
}

const productGroupsSchema = /** @type {const} */ ({
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

const productPathRefsSchema = /** @type {const} */ ({
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

const vulnStatusSchema = /** @type {const} */ ({
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

const vulnOptionalRefsSchema = /** @type {const} */ ({
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

const noteWithProductIdsSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_ids: {
      elements: { type: 'string' },
    },
  },
})

const docNotesSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        notes: { elements: noteWithProductIdsSchema },
      },
    },
  },
})

const vulnNotesSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          notes: { elements: noteWithProductIdsSchema },
        },
      },
    },
  },
})

const vulnInvolvementsSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          involvements: {
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

const hasDocNotes = ajv.compile(docNotesSchema)
const hasProductGroups = ajv.compile(productGroupsSchema)
const hasProductPathRefs = ajv.compile(productPathRefsSchema)
const hasVulnStatus = ajv.compile(vulnStatusSchema)
const hasVulnOptionalRefs = ajv.compile(vulnOptionalRefsSchema)
const hasVulnNotes = ajv.compile(vulnNotesSchema)
const hasVulnInvolvements = ajv.compile(vulnInvolvementsSchema)

/**
 * Collects all product IDs in a set that are referenced anywhere in the document
 *
 * @param {unknown} doc
 * @returns {Set<string>}
 */
function collectReferencedProductIds(doc) {
  /** @type {Set<string>} */
  const ids = new Set()
  collectDocumentNotes(doc, ids)
  collectProductGroups(doc, ids)
  collectProductPathRefs(doc, ids)
  collectVulnerabilityStatus(doc, ids)
  collectVulnerabilityOptionalRefs(doc, ids)
  collectVulnerabilityNotes(doc, ids)
  collectVulnerabilityInvolvements(doc, ids)
  return ids
}

/**
 * Collects all product IDs that are referenced in document notes
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectDocumentNotes(doc, ids) {
  if (hasDocNotes(doc)) {
    for (const note of doc.document.notes) {
      for (const id of note.product_ids ?? []) {
        ids.add(id)
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in product groups
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectProductGroups(doc, ids) {
  if (hasProductGroups(doc)) {
    for (const group of doc.product_tree.product_groups) {
      if (group.product_ids) {
        for (const id of group.product_ids) ids.add(id)
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in product paths
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectProductPathRefs(doc, ids) {
  if (hasProductPathRefs(doc)) {
    for (const productPath of doc.product_tree.product_paths) {
      if (typeof productPath.beginning_product_reference === 'string') {
        ids.add(productPath.beginning_product_reference)
      }
      if (productPath.subpaths) {
        for (const subpath of productPath.subpaths) {
          if (typeof subpath.next_product_reference === 'string') {
            ids.add(subpath.next_product_reference)
          }
        }
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in the product status of vulnerabilities
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectVulnerabilityStatus(doc, ids) {
  if (hasVulnStatus(doc)) {
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
    for (const vulnerability of doc.vulnerabilities) {
      for (const key of keys) {
        const list = vulnerability.product_status?.[key]
        if (list) {
          for (const id of list) {
            ids.add(id)
          }
        }
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in optional references of vulnerabilities
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectVulnerabilityOptionalRefs(doc, ids) {
  if (hasVulnOptionalRefs(doc)) {
    for (const vulnerability of doc.vulnerabilities) {
      for (const remediation of vulnerability.remediations ?? []) {
        for (const id of remediation.product_ids ?? []) {
          ids.add(id)
        }
      }
      for (const metric of vulnerability.metrics ?? []) {
        for (const id of metric.products ?? []) {
          ids.add(id)
        }
      }
      for (const flag of vulnerability.flags ?? []) {
        for (const id of flag.product_ids ?? []) {
          ids.add(id)
        }
      }
      for (const entry of vulnerability.first_known_exploitation_dates ?? []) {
        for (const id of entry.product_ids ?? []) {
          ids.add(id)
        }
      }
      for (const threat of vulnerability.threats ?? []) {
        for (const id of threat.product_ids ?? []) {
          ids.add(id)
        }
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in vulnerability notes
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectVulnerabilityNotes(doc, ids) {
  if (hasVulnNotes(doc)) {
    for (const vulnerability of doc.vulnerabilities) {
      for (const note of vulnerability.notes ?? []) {
        for (const id of note.product_ids ?? []) {
          ids.add(id)
        }
      }
    }
  }
}

/**
 * Collects all product IDs that are referenced in vulnerability involvements
 * @param {unknown} doc
 * @param {Set<string>} ids
 */
function collectVulnerabilityInvolvements(doc, ids) {
  if (hasVulnInvolvements(doc)) {
    for (const vulnerability of doc.vulnerabilities) {
      for (const involvement of vulnerability.involvements ?? []) {
        for (const id of involvement.product_ids ?? []) {
          ids.add(id)
        }
      }
    }
  }
}
