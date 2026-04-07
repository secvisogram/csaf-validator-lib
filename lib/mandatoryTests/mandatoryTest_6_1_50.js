import Ajv from 'ajv/dist/jtd.js'
import { parse } from '@csaf-rs/vers-rs'

const ajv = new Ajv()

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

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    branches: { elements: { additionalProperties: true, properties: {} } },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * @param {any} doc
 */
export function mandatoryTest_6_1_50(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []

  if (!validateInput(doc)) {
    return { isValid: true, errors }
  }

  let isValid = true

  // Check branches if they exist
  if (doc.product_tree?.branches) {
    isValid = checkBranches({
      path: '/product_tree/branches',
      branches: doc.product_tree.branches,
      errors,
    })
  }

  return { isValid, errors }
}

/**
 * @param {object} params
 * @param {string} params.path
 * @param {unknown[]} params.branches
 * @param {Array<{ message: string; instancePath: string }>} params.errors
 * @returns {boolean} isValid
 */
function checkBranches({ path, branches, errors }) {
  let isValid = true

  branches.forEach((branch, branchIndex) => {
    if (!validateBranch(branch)) {
      return
    }

    if (
      branch.category === 'product_version_range' &&
      typeof branch.name === 'string'
    ) {
      const version = branch.name

      if (version.startsWith('vers:')) {
        const parseResult = parseVers(version)
        if (!parseResult.ok) {
          isValid = false
          errors.push({
            message: `${parseResult.error}`,
            instancePath: `${path}/${branchIndex}`,
          })
        }
      } else {
        // TODO: Vers-like Specifier (VLS) – noch nicht implementiert, da kein Repository vorhanden
      }
    }

    // Recursively check nested branches
    if (Array.isArray(branch.branches)) {
      const nestedValid = checkBranches({
        path: `${path}/${branchIndex}/branches`,
        branches: branch.branches,
        errors,
      })
      if (!nestedValid) isValid = false
    }
  })

  return isValid
}

/**
 * @param {string} version
 * @returns {{ ok: true } | { ok: false; error: string }}
 */
function parseVers(version) {
  try {
    parse(version)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
