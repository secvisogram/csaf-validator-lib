import { Ajv } from 'ajv/dist/jtd.js'
import {
  branchSchema,
  collectCtpvrsByProductId,
  collectProductStatusGroupsByProductId,
  filterLeaf,
  isPvss,
} from '../shared/productVersionRangeHelper/productVersionRange.js'
import { initVls, isValidVls } from '../shared/productVersionRangeHelper/vls.js'
import { createVlsOverlapChecker } from '../shared/productVersionRangeHelper/vlsRangesOverlap.js'
import {
  initVers,
  isValidVers,
  versRangeContainsVersion,
} from '../shared/productVersionRangeHelper/versRangesOverlap.js'

const ajv = new Ajv()

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
 * This implements the recommended test 6.2.50.3 of the CSAF 2.1 standard.
 *
 * For each item in `/vulnerabilities` all `EPVRPID` (Product IDs of elements with
 * a product version range, "EPVR") in the product status groups are identified.
 * For each `EPVR` it is checked whether sibling elements of `PVSS+l` (product
 * version siblings with a product leaf) that overlap with it belong to a
 * contradicting product status group.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_50_3(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const ctpvrsByProductId = collectCtpvrsByProductId(doc.product_tree?.branches)
  if (ctpvrsByProductId.size === 0 || !doc.vulnerabilities?.length) {
    return ctx
  }

  await Promise.all([initVers(), initVls()])

  // Shared across vulnerabilities so each range and version pair is evaluated only once.
  const vlsRangesOverlap = createVlsOverlapChecker()

  /**
   * Whether the product version lies within the range (vers or legacy vls).
   *
   * @param {string} range
   * @param {string} version
   */
  const rangeContainsVersion = (range, version) => {
    if (/^\s*vers:/.test(range)) {
      return versRangeContainsVersion(range, version)
    }
    return !isValidVers(range) && isValidVls(range)
      ? vlsRangesOverlap(range, version.trim())
      : false
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const productStatus = vulnerability.product_status
    if (!productStatus) return

    // A product can be a member of several contradicting groups.
    const productStatusGroupsByProductId =
      collectProductStatusGroupsByProductId(productStatus)

    /** @type {Set<string>} */
    const reportedPairs = new Set()

    for (const [productId, groups] of productStatusGroupsByProductId) {
      for (const productCtpvr of ctpvrsByProductId.get(productId) ?? []) {
        const rangeName = productCtpvr.ctpvr.name
        if (rangeName === undefined) continue

        // PVSS+l
        const pvssLeaves = filterLeaf(productCtpvr.siblings.filter(isPvss))

        for (const sibling of pvssLeaves) {
          const siblingId = /** @type {string} */ (sibling.productId)
          const siblingGroups = productStatusGroupsByProductId.get(siblingId)
          // Siblings that are not referenced in the product status groups are
          // irrelevant. Groups only contradict if they differ.
          if (
            siblingGroups === undefined ||
            sibling.name === undefined ||
            siblingId === productId
          ) {
            continue
          }
          const contradicting = [...groups].some((group) =>
            [...siblingGroups].some((other) => other !== group)
          )
          if (
            !contradicting ||
            !rangeContainsVersion(rangeName, sibling.name)
          ) {
            continue
          }

          const pair = JSON.stringify([productId, siblingId])
          if (reportedPairs.has(pair)) continue
          reportedPairs.add(pair)

          ctx.warnings.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status`,
            message:
              `Product version range "${rangeName}" of ${productId} overlaps ` +
              `with product version "${sibling.name}" of ${siblingId}, which ` +
              'belongs to a contradicting product status group.',
          })
        }
      }
    }
  })

  return ctx
}
