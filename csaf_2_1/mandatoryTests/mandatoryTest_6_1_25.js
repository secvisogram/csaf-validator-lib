import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const productIdentificationHelperSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    hashes: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          file_hashes: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                algorithm: { type: 'string' },
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
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    product: {
      additionalProperties: true,
      optionalProperties: {
        product_identification_helper: productIdentificationHelperSchema,
      },
    },
  },
})

const validateBranch = ajv.compile(branchSchema)

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_identification_helper: productIdentificationHelperSchema,
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
        full_product_names: {
          elements: fullProductNameSchema,
        },
        product_paths: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: fullProductNameSchema,
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core').JTDDataType<typeof fullProductNameSchema>} FullProductName
 */

/**
 * This implements the mandatory test 6.1.25 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export default function mandatoryTest_6_1_25(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.product_tree?.branches?.forEach((branch, index) => {
    checkBranch(`/product_tree/branches/${index}`, branch)
  })

  doc.product_tree?.full_product_names?.forEach((fullProductName, index) => {
    checkFullProductName(
      `/product_tree/full_product_names/${index}`,
      fullProductName
    )
  })

  doc.product_tree?.product_paths?.forEach((productPath, index) => {
    const fullProductName = productPath.full_product_name
    if (fullProductName) {
      checkFullProductName(
        `/product_tree/product_paths/${index}/full_product_name`,
        fullProductName
      )
    }
  })

  return ctx

  /**
   * Check for duplicate hash algorithms in the file_hashes of a full product name.
   *
   * @param {string} prefix
   * @param {FullProductName} fullProductName
   */
  function checkFullProductName(prefix, fullProductName) {
    fullProductName.product_identification_helper?.hashes?.forEach(
      (hash, hashIndex) => {
        checkDuplicateHashAlgorithms(
          hash,
          `${prefix}/product_identification_helper/hashes/${hashIndex}`
        )
      }
    )
  }

  /**
   * Check for duplicate hash algorithms in the file_hashes of a branch and its children.
   *
   * @param {string} prefix
   * @param {Branch} branch
   */
  function checkBranch(prefix, branch) {
    branch.product?.product_identification_helper?.hashes?.forEach(
      (hash, hashIndex) => {
        checkDuplicateHashAlgorithms(
          hash,
          `${prefix}/product/product_identification_helper/hashes/${hashIndex}`
        )
      }
    )
    branch.branches?.forEach((childBranch, index) => {
      if (validateBranch(childBranch)) {
        checkBranch(`${prefix}/branches/${index}`, childBranch)
      }
    })
  }

  /**
   * Check a single hash entry for duplicate algorithm values in file_hashes.
   *
   * @param {{ file_hashes?: Array<{ algorithm?: string }> }} hash
   * @param {string} hashPrefix  e.g. ".../hashes/0"
   */
  function checkDuplicateHashAlgorithms(hash, hashPrefix) {
    if (!Array.isArray(hash.file_hashes)) return
    /** @type {Set<string>} */
    const algorithmSet = new Set()
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      if (fileHash.algorithm == null) return
      if (algorithmSet.has(fileHash.algorithm)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `${hashPrefix}/file_hashes/${fileHashIndex}`,
          message: `there is already a hash with the algorithm ${fileHash.algorithm}`,
        })
      }
      algorithmSet.add(fileHash.algorithm)
    })
  }
}
