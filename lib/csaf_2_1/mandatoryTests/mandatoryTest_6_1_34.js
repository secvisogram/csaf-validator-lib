import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      properties: {
        branches: {
          elements: {
            additionalProperties: true,
            properties: {},
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
  },
})

const validate = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * Recursive function to traverse branches and count the depth of nested branches.
 *
 * @param {Array<any>} branches
 * @param {number} depth
 * @param {string} path
 * @param {Array<{ instancePath: string, message: string }>} errors
 */
function validateBranchesDepth(branches, depth, path, errors) {
  if (depth > 30) {
    errors.push({
      instancePath: path,
      message: "The complete JSON path contains 31 `branches`",
    })
    return
  }

  // recursive check
  branches.forEach((branch, index) => {
    if (!validateBranch(branch)) {
      return
    }

    const currentPath = `${path}/branches/${index}`
    if (branch.branches) {
      validateBranchesDepth(branch.branches, depth + 1, currentPath, errors)
    }
  })
}

/**
 * @param {any} doc
 */
export default function mandatoryTest_6_1_34(doc) {
  const ctx = {
    errors: [],
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  if (doc.product_tree && doc.product_tree.branches) {
    validateBranchesDepth(
      doc.product_tree.branches,
      1,
      '/product_tree',
      ctx.errors
    )
  }

  if (ctx.errors.length > 0) {
    ctx.isValid = false
  }

  return ctx
}
