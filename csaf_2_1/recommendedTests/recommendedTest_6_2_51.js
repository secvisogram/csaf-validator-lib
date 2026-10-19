import { Ajv } from 'ajv/dist/jtd.js'
import { walkPath } from '../../lib/walkPaths.js'
import {
  initVers,
  isSupportedVersScheme,
} from '../shared/productVersionRangeHelper/vers.js'

// Regex to extracts the versioning type with the format `vers:<type>/<constraints>`.
const VERS_PREFIX = new RegExp('^vers:([a-z\\.\\-\\+][a-z0-9\\.\\-\\+]*)/.+')

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
  },
})

const validateBranch = ajv.compile(branchSchema)

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

// VERS types registered in the vers specification (docs/types/vers-types.md)
const REGISTERED_VERS_TYPES = new Set([
  'alpm',
  'apk',
  'cargo',
  'composer',
  'cpan',
  'dart',
  'deb',
  'gem',
  'golang',
  'hackage',
  'maven',
  'nuget',
  'npm',
  'pypi',
  'rpm',
  'all',
  'datetime',
  'generic',
  'intdot',
  'lexicographic',
  'none',
  'semver',
])

/**
 * This implements the recommended test 6.2.51 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_51(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  await initVers()

  await walkPath(
    doc,
    '/product_tree/branches[*]',
    async (instancePath, branch) => {
      if (!validateBranch(branch)) return
      if (branch.category !== 'product_version_range') return
      if (typeof branch.name !== 'string') return

      const match = branch.name.trim().match(VERS_PREFIX)
      const type = match?.[1]?.toLowerCase()
      if (!type) return

      if (!REGISTERED_VERS_TYPES.has(type)) {
        ctx.warnings.push({
          instancePath: `${instancePath}/name`,
          message: `usage of unknown version type \`${type}\` (not registered, not supported)`,
        })
      } else if (!isSupportedVersScheme(branch.name)) {
        ctx.warnings.push({
          instancePath: `${instancePath}/name`,
          message: `usage of unknown version type \`${type}\` (registered, not supported)`,
        })
      }
    }
  )

  return ctx
}
