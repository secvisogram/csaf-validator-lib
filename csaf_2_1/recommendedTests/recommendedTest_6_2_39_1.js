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
          group_ids: { elements: { type: 'string' } },
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
        product_groups: {
          elements: {
            additionalProperties: true,
            properties: {
              group_id: { type: 'string' },
              product_ids: { elements: { type: 'string' } },
            },
          },
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

  /** @type {Map<string, { branchCategory: string; name: string; productLine: string }>} */
  const productBranchMap = new Map()
  for (const branch of doc.product_tree?.branches ?? []) {
    collectProductBranch(branch, productBranchMap, [])
  }

  /** @type {Map<string, Set<string>>} */
  const productGroupMap = new Map()
  for (const group of doc.product_tree?.product_groups ?? []) {
    productGroupMap.set(group.group_id, new Set(group.product_ids))
  }

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

    const fixedProductIds = [
      ...(productStatus.fixed ?? []),
      ...(productStatus.first_fixed ?? []),
    ]
    // We only care about fixed products that are actually listed in the branch tree,
    // because if no branch info is available we fall back to "any fixed product exists" which is a more lenient check.
    /** @type {Set<string>} */
    const fixedProductLines = new Set()
    for (const fixedId of fixedProductIds) {
      const entry = productBranchMap.get(fixedId)
      if (entry !== undefined) {
        fixedProductLines.add(entry.productLine)
      }
    }

    affectedProductIds.forEach((productId) => {
      const affectedEntry = productBranchMap.get(productId)

      const fixedVersionExists =
        affectedEntry !== undefined
          ? fixedProductLines.has(affectedEntry.productLine)
          : fixedProductIds.length > 0

      if (fixedVersionExists) return

      // Collect all remediations that apply to the affected product, either directly via product_ids or indirectly via group_ids.
      // If no product_ids or group_ids are given, the remediation applies to all products.
      const productRemediations = remediations.filter((remediation) => {
        if (remediation.product_ids?.includes(productId)) return true

        const matchesGroup = remediation.group_ids?.some((gid) =>
          productGroupMap.get(gid)?.has(productId)
        )
        if (matchesGroup) return true

        return !remediation.product_ids && !remediation.group_ids
      })

      const hasSkipIndicator = productRemediations.some((remediation) =>
        SKIP_CATEGORIES.has(remediation.category)
      )

      if (hasSkipIndicator) {
        // Anti-skip: vendor_fix AND the affected product is a strict-'<' range
        // "a version might exist" MUST NOT skip
        const hasVendorFix = productRemediations.some(
          (remediation) => remediation.category === 'vendor_fix'
        )
        const hasStrictRange =
          affectedEntry?.branchCategory === 'product_version_range' &&
          hasLessThanComparator(affectedEntry.name)

        if (!(hasVendorFix && hasStrictRange)) return
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
  const versionPart = name.includes('/')
    ? name.slice(name.indexOf('/') + 1)
    : name
  const lastConstraint = versionPart.split('|').at(-1)?.trim() ?? ''
  return lastConstraint.startsWith('<') && !lastConstraint.startsWith('<=')
}

/**
 * Recursively walks a branch and populates the map with the immediate branch
 * category and name for every leaf product (i.e. the branch that carries the
 * `product` object). The productLine is constructed as the concatenation of
 * all parent branches with category and name, separated by "|". This allows
 * to check if a fixed product is in the same product line as the affected product.
 *
 * @param {Branch} branch
 * @param {Map<string, { branchCategory: string; name: string; productLine: string }>} map
 * @param {Array<{category: string; name: string}>} productLine
 */
function collectProductBranch(branch, map, productLine) {
  if (
    branch.product?.product_id &&
    branch.category &&
    branch.name !== undefined
  ) {
    map.set(branch.product.product_id, {
      branchCategory: branch.category,
      name: branch.name,
      productLine: productLine.map((a) => `${a.category}:${a.name}`).join('|'),
    })
  }
  if (Array.isArray(branch.branches)) {
    const nextProductLine =
      branch.category !== undefined && branch.name !== undefined
        ? [...productLine, { category: branch.category, name: branch.name }]
        : productLine
    for (const child of branch.branches) {
      if (!validateBranch(child)) continue
      collectProductBranch(child, map, nextProductLine)
    }
  }
}
