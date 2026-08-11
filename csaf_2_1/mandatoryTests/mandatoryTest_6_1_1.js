import { walkPath } from '../../lib/walkPaths.js'
import { collectProductIdsFromFullProductPath } from './shared/docProductUtils.js'

/**
 * All paths in a CSAF 2.1 document that may contain references to product IDs.
 * @type {string[]}
 */
const PRODUCT_ID_REF_PATHS = [
  '/document/notes[]/product_ids[]',
  '/product_tree/product_groups[]/product_ids[]',
  '/product_tree/product_paths[]/beginning_product_reference',
  '/product_tree/product_paths[]/subpaths[]/next_product_reference',
  '/vulnerabilities[]/product_status/first_affected[]',
  '/vulnerabilities[]/product_status/first_fixed[]',
  '/vulnerabilities[]/product_status/fixed[]',
  '/vulnerabilities[]/product_status/known_affected[]',
  '/vulnerabilities[]/product_status/known_not_affected[]',
  '/vulnerabilities[]/product_status/last_affected[]',
  '/vulnerabilities[]/product_status/recommended[]',
  '/vulnerabilities[]/product_status/under_investigation[]',
  '/vulnerabilities[]/product_status/unknown[]',
  '/vulnerabilities[]/remediations[]/product_ids[]',
  '/vulnerabilities[]/metrics[]/products[]',
  '/vulnerabilities[]/threats[]/product_ids[]',
  '/vulnerabilities[]/flags[]/product_ids[]',
  '/vulnerabilities[]/first_known_exploitation_dates[]/product_ids[]',
  '/vulnerabilities[]/ids[]/product_ids[]',
  '/vulnerabilities[]/involvements[]/product_ids[]',
  '/vulnerabilities[]/notes[]/product_ids[]',
]

/**
 * This implements the mandatory test 6.1.1 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function mandatoryTest_6_1_1(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  const definedIds = new Set(
    collectProductIdsFromFullProductPath(/** @type {any} */ (doc)).map(
      (p) => p.id
    )
  )

  for (const path of PRODUCT_ID_REF_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string' && !definedIds.has(value)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath,
          message: 'definition of product id missing',
        })
      }
    })
  }

  return ctx
}
