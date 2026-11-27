import { Ajv } from 'ajv/dist/jtd.js'
import {
  initVers,
  isSupportedVersScheme,
  isValidVers,
} from '../shared/productVersionRangeHelper/versRangesOverlap.js'
import { initVls, isValidVls } from '../shared/productVersionRangeHelper/vls.js'
import { isVersFormat } from '../shared/productVersionRangeHelper/productVersionRange.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    branches: { elements: { additionalProperties: true, properties: {} } },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: { elements: { additionalProperties: true, properties: {} } },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

const VERS_CONSTRAINT = /^(?:<=|>=|!=|<|>|=)?[^<>=!|*\s]+$/

/**
 * vers-rs rejects schemes it does not know although they are valid vers. For
 * those only the generic syntax is checked.
 *
 * @param {string} range
 * @returns {boolean}
 */
function isValidVersOfUnknownScheme(range) {
  const match = /^vers:([a-z.+-][a-z0-9.+-]*)\/(.+)$/.exec(range)
  if (!match) return false
  const [, scheme, constraints] = match
  if (isSupportedVersScheme(scheme)) return false
  // `*` is valid for every scheme, but only as the whole constraint list
  if (constraints === '*') return true
  return constraints.split('|').every((c) => VERS_CONSTRAINT.test(c))
}

/**
 * This implements the mandatory test 6.1.50 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export async function mandatoryTest_6_1_50(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []

  if (!validateInput(doc)) {
    return { isValid: true, errors }
  }

  await Promise.all([initVers(), initVls()])

  checkBranches(doc.product_tree?.branches ?? [], '/product_tree/branches')

  return { isValid: errors.length === 0, errors }

  /**
   * @param {unknown[]} branches
   * @param {string} path
   */
  function checkBranches(branches, path) {
    branches.forEach((branch, index) => {
      if (!validateBranch(branch)) return
      const branchPath = `${path}/${index}`

      if (
        branch.category === 'product_version_range' &&
        typeof branch.name === 'string'
      ) {
        const name = branch.name.trim()
        const isValid = isVersFormat(name)
          ? isValidVers(name) || isValidVersOfUnknownScheme(name)
          : isValidVls(name)
        if (!isValid) {
          errors.push({
            message: `The product version range '${branch.name}' is neither a valid vers nor a valid vls.`,
            instancePath: `${branchPath}/name`,
          })
        }
      }

      if (Array.isArray(branch.branches)) {
        checkBranches(branch.branches, `${branchPath}/branches`)
      }
    })
  }
}
