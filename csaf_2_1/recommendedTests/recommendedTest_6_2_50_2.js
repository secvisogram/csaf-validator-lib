import { Ajv } from 'ajv/dist/jtd.js'
import { isVlsFormat } from '../shared/productVersionRange.js'

const ajv = new Ajv()

/**
 * The product status groups that contradict each other (see section
 * 3.2.4.12 of the CSAF 2.1 standard). Properties listed within the same
 * group do not contradict each other.
 */
const CONTRADICTING_PRODUCT_STATUS_GROUPS = /** @type {const} */ ({
  affected: ['first_affected', 'known_affected', 'last_affected'],
  not_affected: ['known_not_affected'],
  fixed: ['first_fixed', 'fixed'],
  under_investigation: ['under_investigation'],
  unknown: ['unknown'],
})

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_identification_helper: {
      additionalProperties: true,
      optionalProperties: {
        cpe: { type: 'string' },
        purls: { elements: { type: 'string' } },
      },
    },
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    product: fullProductNameSchema,
  },
})

const validateBranch = ajv.compile(branchSchema)

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
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
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              first_affected: { elements: { type: 'string' } },
              first_fixed: { elements: { type: 'string' } },
              fixed: { elements: { type: 'string' } },
              known_affected: { elements: { type: 'string' } },
              known_not_affected: { elements: { type: 'string' } },
              last_affected: { elements: { type: 'string' } },
              recommended: { elements: { type: 'string' } },
              under_investigation: { elements: { type: 'string' } },
              unknown: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 */

/**
 * @typedef {{
 *   instancePath: string
 *   name: string | undefined
 *   vlsSiblings: Array<{ productId: string; name: string; instancePath: string }>
 * }} Epvr
 */

/**
 * Walks `branches` recursively and, for every "group of sibling elements of
 * the product version range" (`GSEPVR`, i.e. one `branches` array), records
 * every "element with product version range" (`EPVR`) together with its
 * sibling `PVRSS+l-vls` candidates (product version range siblings with a
 * product leaf that use the legacy "vls" syntax instead of `vers:`).
 *
 * @param {unknown} branches
 * @param {string} basePath
 * @param {Map<string, Epvr>} epvrByProductId
 */
function collectEpvrGroups(branches, basePath, epvrByProductId) {
  if (!Array.isArray(branches)) return

  /** @type {Array<{ productId: string; name: string; instancePath: string }>} */
  const vlsCandidates = []

  branches.forEach((value, index) => {
    if (!validateBranch(value)) return
    const branch = value

    if (
      branch.category === 'product_version_range' &&
      typeof branch.product?.product_id === 'string' &&
      typeof branch.name === 'string' &&
      isVlsFormat(branch.name)
    ) {
      vlsCandidates.push({
        productId: branch.product.product_id,
        name: branch.name,
        instancePath: `${basePath}/${index}/product`,
      })
    }
  })

  branches.forEach((value, index) => {
    if (!validateBranch(value)) return
    const branch = value
    const branchPath = `${basePath}/${index}`

    if (
      branch.category === 'product_version_range' &&
      typeof branch.product?.product_id === 'string'
    ) {
      const productId = branch.product.product_id
      epvrByProductId.set(productId, {
        instancePath: `${branchPath}/product`,
        name: typeof branch.name === 'string' ? branch.name : undefined,
        // Siblings of this CTPVR, excluding itself.
        vlsSiblings: vlsCandidates.filter(
          (candidate) => candidate.productId !== productId
        ),
      })
    }

    if (Array.isArray(branch.branches)) {
      collectEpvrGroups(
        branch.branches,
        `${branchPath}/branches`,
        epvrByProductId
      )
    }
  })
}

/**
 * This implements the recommended test 6.2.50.2 of the CSAF 2.1 standard.
 *
 * For each item in `/vulnerabilities` all `EPVRPID` (Product IDs of elements with
 * a product version range, "EPVR") in the product status groups are identified.
 * For each `EPVR` it is checked whether sibling elements of `PVRSS+l-vls` (product
 * version range siblings with a product leaf using the legacy "vls" syntax) that
 * overlap with it belong to a contradicting product status group.
 *
 * NOTE: This library currently has no parser/overlap-detector for the "vls"
 * grammar (version range strings that do not use the `vers:` comparator, e.g.
 * `>2.1.0|<4.2.0`). Without such a helper it cannot be reliably determined
 * whether two "vls" ranges actually overlap, so this test cannot emit
 * warnings yet - see `csaf_2_1/shared/productVersionRange.js` for the
 * (missing) building block this test depends on.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_50_2(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  // Collect every EPVR, keyed by its EPVRPID, together with its sibling
  // PVRSS+l-vls candidates, so it can be looked up below.
  /** @type {Map<string, Epvr>} */
  const epvrByProductId = new Map()

  collectEpvrGroups(
    doc.product_tree?.branches,
    '/product_tree/branches',
    epvrByProductId
  )

  doc.vulnerabilities?.forEach((vulnerability) => {
    const productStatus = vulnerability.product_status
    if (!productStatus) return

    // Map every EPVRPID referenced in the product status groups to the
    // contradicting group it belongs to.
    /** @type {Map<string, string>} */
    const groupByProductId = new Map()
    for (const [group, properties] of Object.entries(
      CONTRADICTING_PRODUCT_STATUS_GROUPS
    )) {
      for (const property of properties) {
        for (const productId of productStatus[property] ?? []) {
          groupByProductId.set(productId, group)
        }
      }
    }

    for (const [productId, group] of groupByProductId) {
      const epvr = epvrByProductId.get(productId) // CTPVR
      if (!epvr) continue

      for (const sibling of epvr.vlsSiblings) {
        const siblingGroup = groupByProductId.get(sibling.productId)
        // Siblings that are not referenced in the product status groups, or
        // that are in the same (non-contradicting) group, are irrelevant.
        if (siblingGroup === undefined || siblingGroup === group) continue

        // TODO: missing library function - determine whether the "vls"
        // product version ranges `epvr.name` and `sibling.name` actually
        // overlap (see note above). Until a `vlsRangesOverlap(a, b)` helper
        // exists, a warning is deliberately NOT emitted here to avoid false
        // positives.
      }
    }
  })

  return ctx
}
