import { walkPath } from '../../lib/walkPaths.js'

const PRODUCT_ID_DEFINITION_PATHS = /** @type {const} */ ([
  '/product_tree/branches[*]/product/product_id',
  '/product_tree/full_product_names[]/product_id',
  '/product_tree/product_paths[]/full_product_name/product_id',
])

const PRODUCT_ID_REFERENCE_PATHS = /** @type {const} */ ([
  '/document/notes[]/product_ids[]',
  '/product_tree/product_groups[]/product_ids[]',
  '/product_tree/product_paths[]/beginning_product_reference',
  '/product_tree/product_paths[]/subpaths[]/next_product_reference',
  '/vulnerabilities[]/first_known_exploitation_dates[]/product_ids[]',
  '/vulnerabilities[]/flags[]/product_ids[]',
  '/vulnerabilities[]/ids[]/product_ids[]',
  '/vulnerabilities[]/involvements[]/product_ids[]',
  '/vulnerabilities[]/metrics[]/products[]',
  '/vulnerabilities[]/notes[]/product_ids[]',
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
  '/vulnerabilities[]/threats[]/product_ids[]',
])

/**
 * This implements the recommended test 6.2.1 of the CSAF 2.1 standard.
 * @param {any} doc
 */
export async function recommendedTest_6_2_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (doc?.document?.category === 'csaf_informational_advisory') {
    return ctx
  }

  const referencedProductIds = await collectReferencedProductIds(doc)

  for (const path of PRODUCT_ID_DEFINITION_PATHS) {
    await walkPath(doc, path, async (instancePath, productId) => {
      if (
        typeof productId === 'string' &&
        !referencedProductIds.has(productId)
      ) {
        ctx.warnings.push({
          instancePath,
          message: 'is not referenced',
        })
      }
    })
  }

  return ctx
}

/**
 * Collects all product_ids that are referenced in the document.
 * @param {unknown} doc
 * @returns {Promise<Set<string>>}
 */
async function collectReferencedProductIds(doc) {
  /** @type {Set<string>} */
  const ids = new Set()

  for (const path of PRODUCT_ID_REFERENCE_PATHS) {
    await walkPath(doc, path, async (_instancePath, value) => {
      if (typeof value === 'string') {
        ids.add(value)
      }
    })
  }

  return ids
}
