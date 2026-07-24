import { Ajv } from 'ajv/dist/jtd.js'
import { walkPath } from '../../lib/walkPaths.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
  },
})

const validateBranch = ajv.compile(branchSchema)

// regex to match the prefix of a product version range that uses the `vers` comparator
const VERS_PREFIX = /^vers:[a-z\.\-\+][a-z0-9\.\-\+]*\//

// regex to match an upper open ended constraint, e.g. `>=1.0.0` or `>1.0.0`
const UPPER_OPEN_ENDED_CONSTRAINT = /^>=?/

/**
 * This implements the recommended test 6.2.49 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_49(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  await walkPath(
    doc,
    '/product_tree/branches[*]',
    async (instancePath, value) => {
      if (!validateBranch(value)) return
      const branch = /** @type {{ category?: string; name?: string }} */ (value)

      if (
        branch.category !== 'product_version_range' ||
        typeof branch.name !== 'string'
      ) {
        return
      }

      if (isUpperOpenEnded(branch.name)) {
        ctx.warnings.push({
          instancePath: `${instancePath}/name`,
          message: `The product version range "${branch.name}" is upper open ended.`,
        })
      }
    }
  )

  return ctx
}

/**
 * Checks whether the last bound defining constraint of a product version
 * range (vers or vls) is upper open ended.
 *
 * @param {string} name
 * @returns {boolean}
 */
function isUpperOpenEnded(name) {
  const trimmed = name.trim()
  if (trimmed === 'vers:all/*') return false

  const versMatch = trimmed.match(VERS_PREFIX)
  const constraints = versMatch ? trimmed.slice(versMatch[0].length) : trimmed

  const boundConstraints = constraints
    .split('|')
    .map((constraint) => constraint.trim())
    .filter(
      (constraint) => constraint.length > 0 && !constraint.startsWith('!=')
    )

  if (boundConstraints.length === 0) return false

  const lastConstraint = boundConstraints[boundConstraints.length - 1]
  return UPPER_OPEN_ENDED_CONSTRAINT.test(lastConstraint)
}
