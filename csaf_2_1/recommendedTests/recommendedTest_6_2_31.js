import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()
const MESSAGE =
  'missing product path: product with serial number or model number should be referenced in a product path.'

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
  optionalProperties: {
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

  const referencedIds = collectReferencedIds(productPaths)

  // Start the recursive check from the root branches
  checkBranches(doc.product_tree?.branches ?? [], referencedIds, ctx)

  const fullProductNames = doc.product_tree?.full_product_names ?? []
  fullProductNames.forEach((fullProductName, index) => {
    if (isUnreferencedHardware(fullProductName, referencedIds)) {
      ctx.warnings.push({
        instancePath: `/product_tree/full_product_names/${index}`,
        message: MESSAGE,
      })
    }
  })

  productPaths.forEach((pp, index) => {
    if (isUnreferencedHardware(pp?.full_product_name, referencedIds)) {
      ctx.warnings.push({
        instancePath: `/product_tree/product_paths/${index}/full_product_name`,
        message: MESSAGE,
      })
    }
  })

  return ctx
}

/**
 * Checks whether a product has serial or model numbers but is not referenced
 * by any product path. Products without product_id are skipped.
 * @param {FullProductName | undefined} product
 * @param {Set<string>} referencedIds
 * @returns {boolean}
 */
function isUnreferencedHardware(product, referencedIds) {
  if (!product?.product_id || !product.product_identification_helper) {
    return false
  }
  const { serial_numbers, model_numbers } =
    product.product_identification_helper
  return (
    Boolean(serial_numbers?.length || model_numbers?.length) &&
    !referencedIds.has(product.product_id)
  )
}

/**
 * Recursive function to check branches for products with serial_numbers or model_numbers
 * but no corresponding product path.
 * @param {Branch[]} branches - The current level of branches to process.
 * @param {Set<string>} referencedIds - Product ids referenced by a product path.
 * @param {{ warnings: Array<{ instancePath: string; message: string }> }} ctx - The context to store warnings.
 * @param {string} [path='/product_tree/branches'] - The current JSON path.
 */
function checkBranches(
  branches,
  referencedIds,
  ctx,
  path = '/product_tree/branches'
) {
  branches?.forEach((branch, branchIndex) => {
    // Skip invalid branches together with all of their descendants
    if (!validateBranch(branch)) return

    const currentPath = `${path}/${branchIndex}`

    if (isUnreferencedHardware(branch.product, referencedIds)) {
      ctx.warnings.push({
        instancePath: `${currentPath}/product`,
        message: MESSAGE,
      })
    }

    if (Array.isArray(branch.branches)) {
      checkBranches(
        branch.branches,
        referencedIds,
        ctx,
        `${currentPath}/branches`
      )
    }
  })
}

/**
 * Collects all product ids referenced by a product path. A product path only
 * counts if it has at least one subpath; the id may be the
 * beginning_product_reference or any subpaths[].next_product_reference.
 * @param {ProductPath[]} productPaths
 * @returns {Set<string>}
 */
function collectReferencedIds(productPaths) {
  const ids = new Set()
  for (const pp of productPaths) {
    const subpaths = pp?.subpaths
    if (!Array.isArray(subpaths) || subpaths.length === 0) continue
    if (pp.beginning_product_reference) ids.add(pp.beginning_product_reference)
    for (const sp of subpaths) {
      if (sp?.next_product_reference) ids.add(sp.next_product_reference)
    }
  }
  return ids
}
