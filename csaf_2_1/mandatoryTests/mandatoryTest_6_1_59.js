import { Ajv } from 'ajv/dist/jtd.js'
import {
  initVls,
  isSingleVersionRange,
} from '../shared/productVersionRangeHelper/vls.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
  },
})
const validateBranch = ajv.compile(branchSchema)

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
        branches: { elements: branchSchema },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 */

/**
 * This implements the mandatory test 6.1.59 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export async function mandatoryTest_6_1_59(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  await initVls()

  const branches = doc.product_tree?.branches ?? []
  branches.forEach((branch, index) => {
    checkBranch(branch, `/product_tree/branches/${index}`, ctx.errors)
  })

  if (ctx.errors.length > 0) {
    ctx.isValid = false
  }

  return ctx
}

/**
 * @param {Branch} branch current branch
 * @param {string} basePath base instance path for error reporting
 * @param {Array<{ instancePath: string; message: string }>} errors
 */
function checkBranch(branch, basePath, errors) {
  if (
    validateBranch(branch) &&
    branch.category === 'product_version_range' &&
    typeof branch.name === 'string' &&
    isSingleVersionRange(branch.name)
  ) {
    errors.push({
      instancePath: `${basePath}/name`,
      message: 'the product version range identifies only a single version',
    })
  }

  // descendants are checked even if this branch itself is malformed
  if (branch && typeof branch === 'object' && Array.isArray(branch.branches)) {
    branch.branches.forEach(
      (/** @type {Branch} */ childBranch, /** @type {number} */ index) => {
        checkBranch(childBranch, `${basePath}/branches/${index}`, errors)
      }
    )
  }
}
