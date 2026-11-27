import { Ajv } from 'ajv/dist/jtd.js'
import {
  branchSchema,
  collectCtpvrsByProductId,
  collectProductStatusGroupsByProductId,
  collectVersLeafPvrss,
} from '../shared/productVersionRangeHelper/productVersionRange.js'
import {
  createVersOverlapChecker,
  initVers,
  isValidVers,
} from '../shared/productVersionRangeHelper/versRangesOverlap.js'

const ajv = new Ajv()

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
 * This implements the informative test 6.3.19.1 of the CSAF 2.1 standard.
 *
 * For each item in `/vulnerabilities` all `EPVRPID` (Product IDs of elements with
 * a product version range, "EPVR") in the product status groups are identified.
 * For each `EPVR` it is checked whether sibling elements of `PVRSS+l-vers` (product
 * version range siblings with a product leaf using the VERS syntax) that
 * overlap with it are members of the same product status group.
 *
 * Every overlapping pair is reported once, as the overlap is commutative.
 *
 * @param {unknown} doc
 */
export async function informativeTest_6_3_19_1(doc) {
  const ctx = {
    infos: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const ctpvrsByProductId = collectCtpvrsByProductId(doc.product_tree?.branches)
  if (ctpvrsByProductId.size === 0 || !doc.vulnerabilities?.length) {
    return ctx
  }

  await initVers()

  // Shared across vulnerabilities so each range pair is evaluated only once.
  const versRangesOverlap = createVersOverlapChecker()

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const productStatus = vulnerability.product_status
    if (!productStatus) return

    const productStatusGroupsByProductId =
      collectProductStatusGroupsByProductId(productStatus)

    /** @type {Set<string>} */
    const reportedPairs = new Set()

    // Siblings that are not referenced in the product status groups are
    // irrelevant. Filtering once per sibling list avoids iterating over all
    // siblings again for every product.
    /** @type {Map<unknown, ReturnType<typeof collectVersLeafPvrss>>} */
    const relevantSiblingsBySiblingList = new Map()
    /** @param {Parameters<typeof collectVersLeafPvrss>[0]} productCtpvr */
    const relevantSiblings = (productCtpvr) => {
      let relevant = relevantSiblingsBySiblingList.get(productCtpvr.siblings)
      if (!relevant) {
        relevant = collectVersLeafPvrss(productCtpvr).filter((sibling) =>
          productStatusGroupsByProductId.has(sibling.productId)
        )
        relevantSiblingsBySiblingList.set(productCtpvr.siblings, relevant)
      }
      return relevant
    }

    for (const [productId, groups] of productStatusGroupsByProductId) {
      for (const productCtpvr of ctpvrsByProductId.get(productId) ?? []) {
        const rangeName = productCtpvr.ctpvr.name
        if (rangeName === undefined || !isValidVers(rangeName)) {
          continue
        }

        for (const sibling of relevantSiblings(productCtpvr)) {
          if (
            sibling.productId === productId ||
            sibling.sibling === productCtpvr.ctpvr
          ) {
            continue
          }
          const siblingGroups = /** @type {Set<string>} */ (
            productStatusGroupsByProductId.get(sibling.productId)
          )
          let sharesGroup = false
          for (const group of groups) {
            if (siblingGroups.has(group)) {
              sharesGroup = true
              break
            }
          }
          if (!sharesGroup || !versRangesOverlap(rangeName, sibling.name)) {
            continue
          }

          const pair = JSON.stringify([productId, sibling.productId].sort())
          if (reportedPairs.has(pair)) continue
          reportedPairs.add(pair)

          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status`,
            message:
              `Product version range "${rangeName}" of ${productId} overlaps ` +
              `with "${sibling.name}" of ${sibling.productId}, which belongs ` +
              'to the same product status group.',
          })
        }
      }
    }
  })

  return ctx
}
