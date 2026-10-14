import { Ajv } from 'ajv/dist/jtd.js'
import {
  branchSchema,
  collectCtpvrsByProductId,
  collectProductStatusGroupsByProductId,
  collectPvrss,
  filterLeaf,
  filterVers,
  isVersFormat,
} from '../shared/productVersionRangeHelper/productVersionRange.js'
import {
  initVers,
  isValidVers,
  versRangesOverlap,
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
 * This implements the recommended test 6.2.50.1 of the CSAF 2.1 standard.
 *
 * For each item in `/vulnerabilities` all `EPVRPID` (Product IDs of elements with
 * a product version range, "EPVR") in the product status groups are identified.
 * For each `EPVR` it is checked whether sibling elements of `PVRSS+l-vers` (product
 * version range siblings with a product leaf using the VERS syntax) that
 * overlap with it belong to a contradicting product status group.
 *
 * Every overlapping pair is reported once, as the overlap is commutative.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_50_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  await initVers()

  const ctpvrsByProductId = collectCtpvrsByProductId(doc.product_tree?.branches)

  doc.vulnerabilities?.forEach((vulnerability) => {
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
        if (
          rangeName === undefined ||
          !isVersFormat(rangeName) ||
          !isValidVers(rangeName)
        ) {
          continue
        }

        // PVRSS+l-vers
        const versSiblings = filterVers(filterLeaf(collectPvrss(productCtpvr)))

        for (const sibling of versSiblings) {
          const siblingGroups = productStatusGroupsByProductId.get(
            sibling.productId
          )
          // Siblings that are not referenced in the product status groups are
          // irrelevant. Groups only contradict if they differ.
          if (siblingGroups === undefined || sibling.productId === productId) {
            continue
          }
          const contradicting = [...groups].some((group) =>
            [...siblingGroups].some((other) => other !== group)
          )
          if (!contradicting || !versRangesOverlap(rangeName, sibling.name)) {
            continue
          }

          const pair = JSON.stringify([productId, sibling.productId].sort())
          if (reportedPairs.has(pair)) continue
          reportedPairs.add(pair)

          ctx.warnings.push({
            instancePath: productCtpvr.instancePath,
            message:
              `Product version range "${rangeName}" of ${productId} overlaps ` +
              `with "${sibling.name}" of ${sibling.productId}, which belongs ` +
              'to a contradicting product status group.',
          })
        }
      }
    }
  })

  return ctx
}
