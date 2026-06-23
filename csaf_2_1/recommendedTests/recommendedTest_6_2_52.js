import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const productIdentificationHelperSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    hashes: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          filename: { type: 'string' },
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
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 */

/**
 * All hash algorithm names mentioned in section 3.1.4.3.2 of the CSAF 2.1 standard.
 * These are derived from the OpenSSL dgst -list output (version 3.4.0, 2024-10-22)
 * with leading dashes removed.
 */
const ALGORITHMS_IN_SPEC = new Set([
  'blake2b512',
  'blake2s256',
  'md4',
  'md5',
  'md5-sha1',
  'mdc2',
  'ripemd',
  'ripemd160',
  'rmd160',
  'sha1',
  'sha224',
  'sha256',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha384',
  'sha512',
  'sha512-224',
  'sha512-256',
  'shake128',
  'shake256',
  'sm3',
  'ssl3-md5',
  'ssl3-sha1',
  'whirlpool',
])

/**
 * This implements the recommended test 6.2.52 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_52(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
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
   * Check all file_hashes algorithm values of a full product name.
   *
   * @param {string} prefix
   * @param {FullProductName} fullProductName
   */
  function checkFullProductName(prefix, fullProductName) {
    fullProductName.product_identification_helper?.hashes?.forEach(
      (hash, hashIndex) => {
        checkHashAlgorithms(
          hash,
          `${prefix}/product_identification_helper/hashes/${hashIndex}`
        )
      }
    )
  }

  /**
   * Check all file_hashes algorithm values of a branch and its children.
   *
   * @param {string} prefix
   * @param {Branch} branch
   */
  function checkBranch(prefix, branch) {
    branch.product?.product_identification_helper?.hashes?.forEach(
      (hash, hashIndex) => {
        checkHashAlgorithms(
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
   * Iterate over file_hashes and warn for each unsupported algorithm value.
   * Differentiates between algorithms listed in section 3.1.4.3.2 (known to
   * the standard) and those not mentioned there at all.
   *
   * @param {{ file_hashes?: Array<{ algorithm?: string }> }} hash
   * @param {string} hashPrefix  e.g. ".../hashes/0"
   */
  function checkHashAlgorithms(hash, hashPrefix) {
    if (!Array.isArray(hash.file_hashes)) return
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      if (fileHash.algorithm == null) return
      const algorithm = fileHash.algorithm
      const instancePath = `${hashPrefix}/file_hashes/${fileHashIndex}/algorithm`

      if (!ALGORITHMS_IN_SPEC.has(algorithm)) {
        ctx.warnings.push({
          instancePath,
          message: `the hash algorithm '${algorithm}' is not listed in section 3.1.4.3.2`,
        })
      }
    })
  }
}
