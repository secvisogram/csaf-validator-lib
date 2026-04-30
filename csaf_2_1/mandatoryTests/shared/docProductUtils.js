import Ajv from 'ajv/dist/jtd.js'

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

const productTreeSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    full_product_names: { elements: fullProductNameSchema },
    product_paths: { elements: productPathEntrySchema },
    branches: { elements: branchSchema },
  },
})

const docSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: productTreeSchema,
  },
})

/**
 * @typedef {import('ajv/dist/core').JTDDataType<typeof docSchema>} Dokument
 * @typedef {import('ajv/dist/core').JTDDataType<typeof branchSchema>} Branch
 */

const validateDoc = ajv.compile(docSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * This method collects definitions of product ids and corresponding names and instancePaths in the given document and returns a result object.
 * @param {Dokument} document
 * @returns {{id: string, name: string, instancePath: string}[]}
 */
export const collectProductIdsFromFullProductPath = ({ document }) => {
  const entries =
    /** @type {{id: string, name: string, instancePath: string}[]} */ ([])

  if (!validateDoc(document)) {
    return entries
  }

  const fullProductNames = document.product_tree?.full_product_names
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

  const productPaths = document.product_tree?.product_paths
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

  const branches = document.product_tree?.branches
  if (branches) {
    traverseBranches(branches, entries, '/product_tree/branches')
  }

  return entries
}

/**
 * @param {Branch[]} branches
 * @param {{id: string, name: string, instancePath: string}[]} entries
 * @param {string} instancePath
 */
const traverseBranches = (branches, entries, instancePath) => {
  branches?.forEach((branch, branchIndex) => {
    if (!validateBranch(branch)) return
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
