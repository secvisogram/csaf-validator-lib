import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const productIdentificationHelperSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    serial_numbers: {
      elements: { type: 'string' },
    },
    model_numbers: {
      elements: { type: 'string' },
    },
  },
})

const productSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_id: { type: 'string' },
    product_identification_helper: productIdentificationHelperSchema,
  },
})

const subpathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    next_product_reference: { type: 'string' },
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    beginning_product_reference: { type: 'string' },
    full_product_name: productSchema,
    subpaths: {
      elements: subpathSchema,
    },
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product: productSchema,
    branches: {
      elements: {
        additionalProperties: true,
        // AJV's JTD does not support recursive schemas.
        // Nested branches are validated at runtime in checkBranches() by calling
        // validateBranch() on each child branch individually during the recursive traversal.
        properties: {},
      },
    },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
        full_product_names: {
          elements: productSchema,
        },
        product_paths: {
          elements: productPathSchema,
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productSchema>} FullProductName
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productPathSchema>} ProductPath
 */

/**
 * This implements the recommended test 6.2.31 of the CSAF 2.1 standard.
 * @param {unknown} doc
 */
export function recommendedTest_6_2_31(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  /** @type {ProductPath[]} */
  const productPaths = Array.isArray(doc.product_tree?.product_paths)
    ? doc.product_tree.product_paths
    : []

  // Start the recursive check from the root branches
  checkBranches(doc.product_tree?.branches ?? [], productPaths, ctx)

  checkFullProductNames(
    doc.product_tree?.full_product_names ?? [],
    productPaths,
    ctx
  )

  productPaths.forEach((pp, index) => {
    const fpn = pp?.full_product_name
    if (!fpn?.product_identification_helper || !fpn.product_id) return
    const { serial_numbers, model_numbers } = fpn.product_identification_helper
    if (
      (serial_numbers?.length || model_numbers?.length) &&
      !checkProductPath(productPaths, fpn.product_id)
    ) {
      ctx.warnings.push({
        instancePath: `/product_tree/product_paths/${index}/full_product_name`,
        message:
          'missing product path: product with serial number or model number should be referenced in a product path.',
      })
    }
  })

  return ctx
}

/**
 * Check full_product_names for serial_numbers or model_numbers
 * @param {FullProductName[]} full_product_names
 * @param {ProductPath[]} productPaths
 * @param {{ warnings: Array<{ instancePath: string; message: string }> }} ctx
 * @param {string} [basePath='/product_tree/full_product_names'] - The base JSON path for warnings
 */
function checkFullProductNames(
  full_product_names,
  productPaths,
  ctx,
  basePath = '/product_tree/full_product_names'
) {
  full_product_names.forEach((fullProductName, index) => {
    if (!fullProductName?.product_identification_helper || !fullProductName.product_id) return
    const { serial_numbers, model_numbers } =
      fullProductName.product_identification_helper

    if (
      (serial_numbers?.length || model_numbers?.length) &&
      !checkProductPath(productPaths, fullProductName.product_id)
    ) {
      ctx.warnings.push({
        instancePath: `${basePath}/${index}`,
        message:
          'missing product path: product with serial number or model number should be referenced in a product path.',
      })
    }
  })
}

/**
 * Recursive function to check branches for products with serial_numbers or model_numbers
 * but no corresponding product path.
 * @param {Branch[]} branches - The current level of branches to process.
 * @param {ProductPath[]} productPaths - The product paths array to check against.
 * @param {{ warnings: Array<{ instancePath: string; message: string }> }} ctx - The context to store warnings.
 * @param {string} [path='/product_tree/branches'] - The current JSON path.
 */
function checkBranches(
  branches,
  productPaths,
  ctx,
  path = '/product_tree/branches'
) {
  branches?.forEach((branch, branchIndex) => {
    // Skip invalid branches
    if (!validateBranch(branch)) return

    const currentPath = `${path}/${branchIndex}`
    const product = branch.product

    if (product) {
      if (product.product_id && product.product_identification_helper) {
        const { serial_numbers, model_numbers } =
          product.product_identification_helper

        if (
          (serial_numbers?.length || model_numbers?.length) &&
          !checkProductPath(productPaths, product.product_id)
        ) {
          ctx.warnings.push({
            instancePath: `${currentPath}/product`,
            message:
              'missing product path: product with serial number or model number should be referenced in a product path.',
          })
        }
      }
    }

    // Recursively check nested branches
    if (Array.isArray(branch.branches)) {
      checkBranches(
        branch.branches,
        productPaths,
        ctx,
        `${currentPath}/branches`
      )
    }
  })
}

/**
 * Check if there is a valid product path referencing the given productId.
 * A product path is valid if it has at least one subpath and the productId
 * matches either the beginning_product_reference or any subpaths[].next_product_reference.
 * @param {ProductPath[]} productPaths
 * @param {string} productId
 * @returns {boolean}
 */
function checkProductPath(productPaths, productId) {
  return productPaths.some((pp) => {
    const subpaths = pp.subpaths
    if (!Array.isArray(subpaths) || subpaths.length === 0) {
      return false
    }

    if (pp.beginning_product_reference === productId) {
      return true
    }

    return subpaths.some((sp) => sp.next_product_reference === productId)
  })
}
