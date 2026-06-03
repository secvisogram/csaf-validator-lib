import { Ajv } from 'ajv/dist/jtd.js'
import { containsMultipleUnescapedStars } from './shared/wildcardUtils.js'

const ajv = new Ajv()

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_identification_helper: {
      additionalProperties: true,
      optionalProperties: {
        skus: { elements: { type: 'string' } },
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
    product: fullProductNameSchema,
  },
})

const validateBranch = ajv.compile(branchSchema)

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
 * Validates all given SKUs and
 * check whether they contain multiple unescaped stars
 *
 * @param {Array<string> | undefined} skus SKUs to check
 * @return {Array<string>} indexes of the SKUs that are invalid
 */
export function checkSkus(skus) {
  /** @type {Array<string>}*/
  const invalidSkus = []
  if (skus) {
    for (let i = 0; i < skus.length; i++) {
      const sku = skus[i]
      if (containsMultipleUnescapedStars(sku)) {
        invalidSkus.push('' + i)
      }
    }
  }
  return invalidSkus
}

/**
 * For each SKU, it MUST be tested
 * that it does not contain multiple unescaped stars.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_61(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test run and is
    finally returned by the function.
   */
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
   *  Check whether the SKUs contain multiple unescaped stars for a full product name object
   *
   * @param {string} prefix The instance path prefix of the "full product name". It is
   *    used to generate error messages.
   * @param {FullProductName} fullProductName The "full product name" object.
   */
  function checkFullProductName(prefix, fullProductName) {
    const invalidNumberIndexes = checkSkus(
      fullProductName?.product_identification_helper?.skus
    )
    invalidNumberIndexes.forEach((invalidNumberIndex) => {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `${prefix}/product_identification_helper/skus/${invalidNumberIndex}`,
        message: 'SKU contains multiple unescaped stars',
      })
    })
  }

  /**
   * Check whether the SKUs contain multiple unescaped stars for the given branch object
   * and its branch children.
   *
   * @param {string} prefix The instance path prefix of the "branch". It is
   *    used to generate error messages.
   * @param {Branch} branch The "branch" object.
   */
  function checkBranch(prefix, branch) {
    const invalidNumberIndexes = checkSkus(
      branch.product?.product_identification_helper?.skus
    )
    invalidNumberIndexes.forEach((invalidNumberIndex) => {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `${prefix}/product/product_identification_helper/skus/${invalidNumberIndex}`,
        message: 'SKU contains multiple unescaped stars',
      })
    })
    branch.branches?.forEach((branch, index) => {
      if (validateBranch(branch)) {
        checkBranch(`${prefix}/branches/${index}`, branch)
      }
    })
  }
}
