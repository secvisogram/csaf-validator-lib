import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    category: { type: 'string' },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof branchSchema>} BranchSchema */

/**
 * This implements the mandatory test 6.1.57 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_57(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  // Start the recursive check from the root branches
  /** @type {Array<BranchSchema>} */
  const branches = doc.product_tree?.branches ?? []
  branches.forEach((branch, index) => {
    checkBranch(branch, `/product_tree/branches/${index}`, [], ctx.errors)
  })

  if (ctx.errors.length > 0) {
    ctx.isValid = false
  }

  return ctx
}

/**
 * Validates a single branch and its nested branches recursively.
 * Checks that no category (except product_family) appears more than once along the path.
 *
 * @param {BranchSchema} branch
 * @param {string} basePath
 * @param {string[]} categoriesInPath
 * @param {Array<{ instancePath: string; message: string }>} errors
 */
function checkBranch(branch, basePath, categoriesInPath, errors) {
  const category = branch.category

  if (category && category !== 'product_family') {
    if (categoriesInPath.includes(category)) {
      errors.push({
        instancePath: `${basePath}/category`,
        message: `Branch category "${category}" appears more than once along the path.`,
      })
    }
  }

  const newCategories =
    category && category !== 'product_family'
      ? [...categoriesInPath, category]
      : categoriesInPath

  // Recursively check nested branches
  if (Array.isArray(branch.branches)) {
    branch.branches.forEach(
      (
        /** @type {BranchSchema} */ childBranch,
        /** @type {number} */ index
      ) => {
        if (!validateBranch(childBranch)) return
        checkBranch(
          childBranch,
          `${basePath}/branches/${index}`,
          newCategories,
          errors
        )
      }
    )
  }
}
