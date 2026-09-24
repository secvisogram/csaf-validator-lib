import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    name: { type: 'string' },
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

const productPathEntrySchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    full_product_name: fullProductNameSchema,
  },
})

const productGroupSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    group_id: { type: 'string' },
    summary: { type: 'string' },
  },
})

const productTreeSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    full_product_names: { elements: fullProductNameSchema },
    product_paths: { elements: productPathEntrySchema },
    product_groups: { elements: productGroupSchema },
    branches: { elements: branchSchema },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: productTreeSchema,
  },
})

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof inputSchema>} InputSchema
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productPathEntrySchema>} ProductPathEntry
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productGroupSchema>} ProductGroup
 */

const validateDoc = ajv.compile(inputSchema)

/**
 * This method collects definitions of product ids and corresponding names and
 * instancePaths in the given document and returns a result object.
 * @param {InputSchema} doc
 * @returns {{id: string, name: string, instancePath: string}[]}
 */
export const collectProductIdsFromFullProductPath = (doc) => {
  const entries =
    /** @type {{id: string, name: string, instancePath: string}[]} */ ([])

  if (!validateDoc(doc)) {
    return entries
  }

  const fullProductNames = doc.product_tree?.full_product_names
  if (fullProductNames) {
    fullProductNames?.forEach((fullProductName, fullProductNameIndex) => {
      if (fullProductName.product_id) {
        entries.push({
          id: fullProductName.product_id,
          name: fullProductName.name ?? '',
          instancePath: `/product_tree/full_product_names/${fullProductNameIndex}/product_id`,
        })
      }
    })
  }

  const productPaths = doc.product_tree?.product_paths
  if (productPaths) {
    productPaths?.forEach((productPath, productPathIndex) => {
      const fullProductName = productPath.full_product_name
      if (fullProductName) {
        if (fullProductName.product_id) {
          entries.push({
            id: fullProductName.product_id,
            name: fullProductName.name ?? '',
            instancePath: `/product_tree/product_paths/${productPathIndex}/full_product_name/product_id`,
          })
        }
      }
    })
  }

  const branches = doc.product_tree?.branches
  if (branches) {
    traverseBranches(branches, entries, '/product_tree/branches')
  }

  return entries
}

/**
 * This method collects definitions of group ids and corresponding names and
 * instancePaths in the given document and returns a result object.
 * @param {InputSchema} doc
 * @returns {{id: string, name: string, instancePath: string}[]}
 */
export const collectGroupIdsFromProductTree = (doc) => {
  const entries =
    /** @type {{id: string, name: string, instancePath: string}[]} */ ([])

  if (!validateDoc(doc)) {
    return entries
  }

  doc.product_tree?.product_groups?.forEach(
    (productGroup, productGroupIndex) => {
      if (productGroup.group_id) {
        entries.push({
          id: productGroup.group_id,
          name: productGroup.summary ?? '',
          instancePath: `/product_tree/product_groups/${productGroupIndex}/group_id`,
        })
      }
    }
  )

  return entries
}

/**
 * Filters a list of references down to those that have no matching definition.
 * A reference is considered unresolved if no entry in `entries` shares the same `id`.
 * @param {{id: string}[]} entries
 * @param {{id: string, instancePath: string}[]} refs
 * @returns {{id: string, instancePath: string}[]}
 */
export const findMissingDefinitions = (entries, refs) => {
  return refs.filter((ref) => !entries.some((e) => e.id === ref.id))
}

/**
 * @param {Branch[]} branches
 * @param {{id: string, name: string, instancePath: string}[]} entries
 * @param {string} instancePath
 */
const traverseBranches = (branches, entries, instancePath) => {
  branches?.forEach((branch, branchIndex) => {
    const branchInstancePath = `${instancePath}/${branchIndex}`
    const product = branch.product
    if (product) {
      if (product.product_id) {
        entries.push({
          id: product.product_id,
          name: product.name ?? '',
          instancePath: `${branchInstancePath}/product/product_id`,
        })
      }
    }
    if (branch.branches) {
      traverseBranches(
        branch.branches,
        entries,
        `${branchInstancePath}/branches`
      )
    }
  })
}
