/**
 * @typedef {Object} FullProductName
 * @property {string} name
 * @property {string} product_id
 */

/**
 * @typedef {Object} Branch
 * @property {Array<Branch>} branches
 * @property {FullProductName} product
 */

/**
 * This method collects definitions of product ids and corresponding names and instancePaths in the given document and returns a result object.
 * @param {any} document
 * @returns {{id: string, name: string, instancePath: string}[]}
 */
export const collectProductIds = ({ document }) => {
  const entries =
    /** @type {{id: string, name: string, instancePath: string}[]} */ ([])

  const fullProductNames = document.product_tree?.full_product_names
  if (fullProductNames) {
    for (let i = 0; i < fullProductNames.length; ++i) {
      const fullProductName = fullProductNames[i]
      if (fullProductName.product_id) {
        entries.push({
          id: fullProductName.product_id,
          name: fullProductName.name ?? '',
          instancePath: `/product_tree/full_product_names/${i}/product_id`,
        })
      }
    }
  }

  const productPaths = document.product_tree?.product_paths
  if (productPaths) {
    for (let i = 0; i < productPaths.length; ++i) {
      const productPath = productPaths[i]
      const fullProductName = productPath.full_product_name
      if (fullProductName) {
        if (fullProductName.product_id) {
          entries.push({
            id: fullProductName.product_id,
            name: fullProductName.name ?? '',
            instancePath: `/product_tree/product_paths/${i}/full_product_name/product_id`,
          })
        }
      }
    }
  }

  const branches = document.product_tree?.branches
  if (branches) {
    traverseBranches(branches, entries, '/product_tree/branches')
  }

  return entries
}

/**
 * @param {Array<Branch>} branches
 * @param {{id: string, name: string, instancePath: string}[]} entries
 * @param {string} instancePath
 */
const traverseBranches = (branches, entries, instancePath) => {
  for (let i = 0; i < branches.length; ++i) {
    const branch = branches[i]
    const branchInstancePath = `${instancePath}/${i}`
    const fullProductName = branch.product
    if (fullProductName) {
      if (fullProductName.product_id) {
        entries.push({
          id: fullProductName.product_id,
          name: fullProductName.name ?? '',
          instancePath: `${branchInstancePath}/product/product_id`,
        })
      }
    }
    if (branch.branches)
      traverseBranches(
        branch.branches,
        entries,
        `${branchInstancePath}/branches`
      )
  }
}
