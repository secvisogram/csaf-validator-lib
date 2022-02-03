const Ajv = require('ajv/dist/jtd.js').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: { elements: { additionalProperties: true, properties: {} } },
        full_product_names: {
          elements: { additionalProperties: true, properties: {} },
        },
        relationships: {
          elements: { additionalProperties: true, properties: {} },
        },
      },
    },
  },
})

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_identification_helper: {
      additionalProperties: true,
      properties: {
        hashes: {
          elements: {
            additionalProperties: true,
            properties: {
              file_hashes: {
                elements: {
                  additionalProperties: true,
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product: {
      additionalProperties: true,
      properties: {
        product_identification_helper: {
          additionalProperties: true,
          properties: {
            hashes: {
              elements: {
                additionalProperties: true,
                properties: {
                  file_hashes: {
                    elements: {
                      additionalProperties: true,
                      properties: {},
                    },
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

const relationshipSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    full_product_name: {
      additionalProperties: true,
      properties: {
        product_identification_helper: {
          additionalProperties: true,
          properties: {
            hashes: {
              elements: {
                additionalProperties: true,
                properties: {
                  file_hashes: {
                    elements: {
                      additionalProperties: true,
                      properties: {},
                    },
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

const validateInput = ajv.compile(inputSchema)
const validateFullProductName = ajv.compile(fullProductNameSchema)
const validateRelationship = ajv.compile(relationshipSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * @param {any} doc
 * @param {string} hashName
 */
module.exports = function (doc, hashName) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.product_tree.full_product_names?.forEach(
    (fullProductName, fullProductNameIndex) => {
      if (!validateFullProductName(fullProductName)) {
        return
      }

      fullProductName.product_identification_helper.hashes.forEach(
        (hash, hashIndex) => {
          const hashSet = getHashAlgorithmSet(hash)
          if (hashSet.has(hashName) && hashSet.size === 1) {
            ctx.warnings.push({
              instancePath: `/product_tree/full_product_names/${fullProductNameIndex}/product_identification_helper/hashes/${hashIndex}`,
              message: 'use of md5 as the only hash algorithm',
            })
          }
        }
      )
    }
  )

  /**
   * @param {string} prefix
   * @param {unknown[]} branches
   */
  const checkBranches = (prefix, branches) => {
    branches.forEach((branch, branchIndex) => {
      if (!validateBranch(branch)) {
        return
      }

      branch.product?.product_identification_helper.hashes.forEach(
        (hash, hashIndex) => {
          const hashSet = getHashAlgorithmSet(hash)
          if (hashSet.has(hashName) && hashSet.size === 1) {
            ctx.warnings.push({
              instancePath: `${prefix}${branchIndex}/product_identification_helper/hashes/${hashIndex}`,
              message: 'use of md5 as the only hash algorithm',
            })
          }
        }
      )
      checkBranches(
        `${prefix}${branchIndex}/branches/`,
        Array.isArray(branch.branches) ? branch.branches : []
      )
    })
  }

  checkBranches('/product_tree/branches/', doc.product_tree.branches ?? [])

  doc.product_tree.relationships?.forEach((relationship, relationshipIndex) => {
    if (!validateRelationship(relationship)) {
      return
    }

    relationship.full_product_name.product_identification_helper.hashes.forEach(
      (hash, hashIndex) => {
        const hashSet = getHashAlgorithmSet(hash)
        if (hashSet.has(hashName) && hashSet.size === 1) {
          ctx.warnings.push({
            instancePath: `/product_tree/relationships/${relationshipIndex}/product_identification_helper/hashes/${hashIndex}`,
            message: 'use of md5 as the only hash algorithm',
          })
        }
      }
    )
  })

  return ctx
}

/**
 *
 * @param {{ file_hashes: Array<{ algorithm?: unknown }> }} hash
 * @returns
 */
function getHashAlgorithmSet(hash) {
  return new Set(
    hash.file_hashes
      .map((h) => h.algorithm)
      .filter(
        /** @returns {v is string} */
        (v) => typeof v === 'string'
      )
  )
}
