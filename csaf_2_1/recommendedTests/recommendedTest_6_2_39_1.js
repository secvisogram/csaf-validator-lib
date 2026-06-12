import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    product: {
      additionalProperties: true,
      optionalProperties: {
        product_id: { type: 'string' },
      },
    },
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})

const vulnerabilitySchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_status: {
      additionalProperties: true,
      optionalProperties: {
        first_affected: { elements: { type: 'string' } },
        known_affected: { elements: { type: 'string' } },
        last_affected: { elements: { type: 'string' } },
        fixed: { elements: { type: 'string' } },
        first_fixed: { elements: { type: 'string' } },
      },
    },
    remediations: {
      elements: {
        additionalProperties: true,
        properties: {
          category: { type: 'string' },
        },
        optionalProperties: {
          product_ids: { elements: { type: 'string' } },
        },
      },
    },
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
    document: {
      additionalProperties: true,
      properties: {
        category: { type: 'string' },
      },
    },
  },
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
      },
    },
    vulnerabilities: {
      elements: vulnerabilitySchema,
    },
  },
})

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof vulnerabilitySchema>} Vulnerability
 */

const validateSchema = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

const SKIP_CATEGORIES = new Set([
  'fix_planned',
  'no_fix_planned',
  'none_available',
])

/**
 * This implements the recommended test 6.2.39.1 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_39_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (
    !validateSchema(doc) ||
    doc.document.category !== 'csaf_security_advisory'
  ) {
    return ctx
  }

  /** @type Vulnerability[] */
  const vulnerabilities = doc.vulnerabilities ?? []

  vulnerabilities.forEach((vulnerability, vulnIndex) => {
    const productStatus = vulnerability.product_status ?? {}
    const remediations = vulnerability.remediations ?? []

    const affectedProductIds = [
      ...(productStatus.first_affected ?? []),
      ...(productStatus.known_affected ?? []),
      ...(productStatus.last_affected ?? []),
    ]

    if (affectedProductIds.length === 0) return

    const hasAnyFixed =
      (productStatus.fixed?.length ?? 0) > 0 ||
      (productStatus.first_fixed?.length ?? 0) > 0

    affectedProductIds.forEach((productId) => {
      if (hasAnyFixed) return

      // Remediations that explicitly reference this product via product_ids
      const productRemediations = remediations.filter((remediation) =>
        remediation.product_ids?.includes(productId)
      )

      const hasSkipIndicator = productRemediations.some((r) =>
        SKIP_CATEGORIES.has(r.category)
      )

      /** @type {Map<string, { branchCategory: string; name: string }>} */
      const productBranchMap = new Map()
      for (const branch of doc.product_tree?.branches ?? []) {
        collectProductBranchInfo(branch, productBranchMap)
      }

      if (hasSkipIndicator) {
        // Anti-skip: vendor_fix AND the affected product is a strict-'<' range
        // → "a version might exist" → MUST NOT skip
        const hasVendorFix = productRemediations.some(
          (remediation) => remediation.category === 'vendor_fix'
        )
        const productBranch = productBranchMap.get(productId)
        const hasStrictRange =
          productBranch?.branchCategory === 'product_version_range' &&
          hasLessThanComparator(productBranch.name)

        const skipWarning = hasVendorFix && hasStrictRange

        if (!skipWarning) return
      }

      ctx.warnings.push({
        instancePath: `/vulnerabilities/${vulnIndex}/product_status`,
        message: `Product "${productId}" is listed as affected but has no corresponding fixed product in the same vulnerability.`,
      })
    })
  })

  return ctx
}

/**
 * Returns true if the version range name has a strict `<` comparator as the
 * last version constraint.  Handles both:
 *  - vls  e.g. "<4.2", ">=2.0|<5.0"
 *  - vers e.g. "vers:npm/>=2.0.0|<5.0.0"
 *
 * @param {string} name
 * @returns {boolean}
 */
function hasLessThanComparator(name) {
  const constraintPart = name.includes('/')
    ? name.split('/').slice(1).join('/')
    : name
  const constraints = constraintPart.split('|')
  const lastConstraint = constraints[constraints.length - 1].trim()
  return lastConstraint.startsWith('<') && !lastConstraint.startsWith('<=')
}

/**
 * Recursively walks a branch and populates the map with the immediate branch
 * category and name for every leaf product (i.e. the branch that carries the
 * `product` object).
 *
 * @param {Branch} branch
 * @param {Map<string, { branchCategory: string; name: string }>} map
 */
function collectProductBranchInfo(branch, map) {
  if (
    branch.product?.product_id &&
    branch.category &&
    branch.name !== undefined
  ) {
    map.set(branch.product.product_id, {
      branchCategory: branch.category,
      name: branch.name,
    })
  }
  if (Array.isArray(branch.branches)) {
    for (const child of branch.branches) {
      if (!validateBranch(child)) continue
      collectProductBranchInfo(child, map)
    }
  }
}
