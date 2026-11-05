import { Ajv } from 'ajv/dist/jtd.js'
import { isValidVers } from './versRangesOverlap.js'

const ajv = new Ajv()

// Regex to match a Version Range Specifier (VERS)
export const VERS_PREFIX = new RegExp(
  '^vers:[a-z\\.\\-\\+][a-z0-9\\.\\-\\+]*/.+'
)

/**
 * Checks whether the `name` matches the `vers` format.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isVersFormat(name) {
  return VERS_PREFIX.test(name.trim())
}

/**
 * Product status groups that contradict each other (see 3.2.4.11 of the
 * CSAF 2.1 standard).
 */
export const CONTRADICTING_PRODUCT_STATUS_GROUPS = /** @type {const} */ ({
  affected: ['first_affected', 'known_affected', 'last_affected'],
  not_affected: ['known_not_affected'],
  fixed: ['first_fixed', 'fixed'],
  under_investigation: ['under_investigation'],
  unknown: ['unknown'],
})

export const fullProductNameSchema = /** @type {const} */ ({
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

export const branchSchema = /** @type {const} */ ({
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

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof fullProductNameSchema>} FullProductName
 *
 * @typedef {{
 *   instancePath: string
 *   ctpvr: Sibling
 *   siblings: Sibling[]
 * }} ProductCtpvr
 *   A product (`EPVRPID`, at `instancePath`) together with one `CTPVR`
 *   above it. `siblings` are all branches on the same level as the
 *   `CTPVR`, including the `CTPVR` itself (see `collectPvrss`). The
 *   array is shared by all products below that level.
 *
 * @typedef {{
 *   category: string | undefined
 *   name: string | undefined
 *   hasBranches: boolean
 *   productId: string | undefined
 * }} Sibling
 *   A branch and its own `product_id` (not the ones of its descendants).
 */

/**
 * Whether the sibling is a `PVRSS` (category `product_version_range`).
 *
 * @param {Sibling} sibling
 */
export function isPvrss(sibling) {
  return sibling.category === 'product_version_range'
}

/**
 * Whether the sibling is a `PVSS` (category `product_version`).
 *
 * @param {Sibling} sibling
 */
export function isPvss(sibling) {
  return sibling.category === 'product_version'
}

/**
 * Whether the sibling is a leaf: has a product, no `branches` (`+l` sets).
 *
 * @param {Sibling} sibling
 */
export function isLeaf(sibling) {
  return !sibling.hasBranches && sibling.productId !== undefined
}

/**
 * Whether the sibling only has `branches` (`+b` sets).
 *
 * @param {Sibling} sibling
 */
export function hasOnlyBranches(sibling) {
  return sibling.hasBranches
}

/**
 * Gets the `PVRSS` siblings of a product's `CTPVR` (without the `CTPVR` itself).
 *
 * @param {ProductCtpvr} productCtpvr
 * @returns {Sibling[]}
 */
export function collectPvrss(productCtpvr) {
  return productCtpvr.siblings.filter(
    (sibling) => sibling !== productCtpvr.ctpvr && isPvrss(sibling)
  )
}

/**
 * Keeps only the leaf siblings.
 *
 * @param {Sibling[]} siblings
 * @returns {Sibling[]}
 */
export function filterLeaf(siblings) {
  return siblings.filter(isLeaf)
}

/**
 * Keeps only siblings whose name is a valid `vers` range.
 *
 * @param {Sibling[]} siblings leaf siblings
 * @returns {Array<{ productId: string; name: string }>}
 */
export function filterVers(siblings) {
  return siblings.flatMap((sibling) =>
    sibling.name !== undefined &&
    isVersFormat(sibling.name) &&
    isValidVers(sibling.name)
      ? [
          {
            productId: /** @type {string} */ (sibling.productId),
            name: sibling.name,
          },
        ]
      : []
  )
}

/**
 * Walks `branches` recursively and adds to `ctpvrsByProductId`.
 *
 * @param {Branch[] | undefined} branches
 * @param {string} basePath
 * @param {Array<{ ctpvr: Sibling; siblings: Sibling[] }>} ctpvrs
 *   the `CTPVR`s on the way down to `branches`
 * @param {Map<string, ProductCtpvr[]>} ctpvrsByProductId
 */
function collectCtpvrsByProductIdRecursive(
  branches,
  basePath,
  ctpvrs,
  ctpvrsByProductId
) {
  if (!Array.isArray(branches)) return

  /** @type {Array<Sibling | undefined>} */
  const siblingsByIndex = branches.map((branch) =>
    validateBranch(branch)
      ? {
          category: branch.category,
          name: branch.name,
          hasBranches: branch.branches !== undefined,
          productId:
            typeof branch.product?.product_id === 'string'
              ? branch.product.product_id
              : undefined,
        }
      : undefined
  )
  const siblings = /** @type {Sibling[]} */ (
    siblingsByIndex.filter((sibling) => sibling !== undefined)
  )

  branches.forEach((branch, index) => {
    const sibling = siblingsByIndex[index]
    if (!sibling || !validateBranch(branch)) return
    const branchPath = `${basePath}/${index}`

    let currentCtpvrs = ctpvrs
    if (branch.category === 'product_version_range') {
      currentCtpvrs = [...ctpvrs, { ctpvr: sibling, siblings }]
    }

    const productId = branch.product?.product_id
    if (typeof productId === 'string' && currentCtpvrs.length > 0) {
      const productCtpvrs = ctpvrsByProductId.get(productId) ?? []
      for (const ctpvr of currentCtpvrs) {
        productCtpvrs.push({ instancePath: `${branchPath}/product`, ...ctpvr })
      }
      ctpvrsByProductId.set(productId, productCtpvrs)
    }

    if (Array.isArray(branch.branches)) {
      collectCtpvrsByProductIdRecursive(
        branch.branches,
        `${branchPath}/branches`,
        currentCtpvrs,
        ctpvrsByProductId
      )
    }
  })
}

/**
 * Finds all products (`EPVRPID`) below `product_version_range` branches
 * (`CTPVR`) and maps each product ID to one `ProductCtpvr` per `CTPVR`
 * on its path.
 *
 * This doesn't decide which sets (`PVRSS`, `PVSS`, `OBCSS`, `+l`, `+b`) or
 * which range syntax (`vers:`, "vls") matters.
 *
 * @param {Branch[] | undefined} branches the `/product_tree/branches` of a document
 * @returns {Map<string, ProductCtpvr[]>}
 */
export function collectCtpvrsByProductId(branches) {
  /** @type {Map<string, ProductCtpvr[]>} */
  const ctpvrsByProductId = new Map()
  collectCtpvrsByProductIdRecursive(
    branches,
    '/product_tree/branches',
    [],
    ctpvrsByProductId
  )
  return ctpvrsByProductId
}

/**
 * Maps each product ID of a `product_status` to the contradicting groups
 * (see `CONTRADICTING_PRODUCT_STATUS_GROUPS`) it belongs to.
 *
 * @param {Partial<Record<
 *   (typeof CONTRADICTING_PRODUCT_STATUS_GROUPS)[keyof typeof CONTRADICTING_PRODUCT_STATUS_GROUPS][number],
 *   string[]
 * >>} productStatus
 * @returns {Map<string, Set<string>>}
 */
export function collectProductStatusGroupsByProductId(productStatus) {
  /** @type {Map<string, Set<string>>} */
  const groupsByProductId = new Map()
  for (const [group, properties] of Object.entries(
    CONTRADICTING_PRODUCT_STATUS_GROUPS
  )) {
    for (const productId of properties.flatMap(
      (property) => productStatus[property] ?? []
    )) {
      if (!groupsByProductId.has(productId)) {
        groupsByProductId.set(productId, new Set())
      }
      groupsByProductId.get(productId)?.add(group)
    }
  }
  return groupsByProductId
}
