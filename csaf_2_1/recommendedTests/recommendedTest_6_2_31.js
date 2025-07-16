import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const relationshipSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_reference: { type: 'string' },
    relates_to_product_reference: { type: 'string' },
  },
})

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
  properties: {
    product_id: { type: 'string' },
  },
  optionalProperties: {
    product_identification_helper: productIdentificationHelperSchema,
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product: productSchema,
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
        relationships: {
          elements: relationshipSchema,
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core').JTDDataType<typeof relationshipSchema>} Relationship
 * @typedef {import('ajv/dist/core').JTDDataType<typeof productIdentificationHelperSchema>} ProductIdentificationHelper
 * @typedef {import('ajv/dist/core').JTDDataType<typeof productSchema>} Product
 * @typedef {import('ajv/dist/core').JTDDataType<typeof productSchema>} FullProductName
 * @typedef {import('ajv/dist/core').JTDDataType<typeof branchSchema>} Branch
 *
 */

/**
 * This implements the optional test 6.2.31 of the CSAF 2.1 standard.
 * @param {any} doc
 */
export function recommendedTest_6_2_31(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const relationships = Array.isArray(doc.product_tree?.relationships)
    ? doc.product_tree.relationships
    : []

  // Start the recursive check from the root branches
  checkBranches(doc.product_tree?.branches ?? [], relationships, ctx)

  checkFullProductNames(
    doc.product_tree?.full_product_names ?? [],
    relationships,
    ctx
  )

  return ctx
}

/**
 * Check full_product_names for serial_numbers or model_numbers
 * @param {Product[]} full_product_names
 * @param {Array<Relationship>} relationships
 * @param {{ warnings: Array<{ instancePath: string; message: string }> }} ctx
 */
function checkFullProductNames(full_product_names, relationships, ctx) {
  full_product_names.forEach((fullProductName, index) => {
    if (
      fullProductName?.product_id &&
      fullProductName?.product_identification_helper
    ) {
      const { serial_numbers, model_numbers } =
        fullProductName.product_identification_helper

      if (
        (serial_numbers?.length || model_numbers?.length) &&
        !hasRelationship(relationships, fullProductName.product_id)
      ) {
        ctx.warnings.push({
          instancePath: `/product_tree/full_product_names/${index}`,
          message:
            'missing relationship: Product with serial or model number must be referenced.',
        })
      }
    }
  })
}

/**
 * Recursive function to check branches for products with serial_numbers or model_numbers
 * but no corresponding relationship.
 * @param {Array<Branch>} branches - The current level of branches to process.
 * @param {Array<Relationship>} relationships - The relationships array to check against.
 * @param {{ warnings: Array<{ instancePath: string; message: string }> }} ctx - The context to store warnings.
 * @param {string} [path='/product_tree/branches'] - The current JSON path.
 */
function checkBranches(
  branches,
  relationships,
  ctx,
  path = '/product_tree/branches'
) {
  branches?.forEach((branch, branchIndex) => {
    const currentPath = `${path}/${branchIndex}`
    const product = branch.product

    if (product?.product_id && product.product_identification_helper) {
      const { serial_numbers, model_numbers } =
        product.product_identification_helper

      if (
        (serial_numbers?.length || model_numbers?.length) &&
        !hasRelationship(relationships, product.product_id)
      ) {
        ctx.warnings.push({
          instancePath: `${currentPath}/product`,
          message:
            'missing relationship: Product with serial or model number must be referenced',
        })
      }
    }

    // Recursively check nested branches
    if (Array.isArray(branch.branches)) {
      checkBranches(
        branch.branches,
        relationships,
        ctx,
        `${currentPath}/branches`
      )
    }
  })
}

/**
 * Helper function to check if a product_id exists in relationships
 * @param {Array<Relationship>} relationships
 * @param {string} productId
 * @returns {boolean}
 */
function hasRelationship(relationships, productId) {
  return relationships.some(
    (rel) =>
      rel.product_reference === productId ||
      rel.relates_to_product_reference === productId
  )
}
