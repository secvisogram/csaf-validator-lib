import { walkPath } from '../../lib/walkPaths.js'

const X_EXTENSIONS_PATHS /** @type {string[]} */ = [
  '/document/x_extensions[]',
  '/product_tree/branches[*]/product/x_extensions[]',
  '/product_tree/full_product_names[]/x_extensions[]',
  '/product_tree/product_paths[]/full_product_name/x_extensions[]',
  '/vulnerabilities[]/metrics[]/content/x_extensions[]',
  '/vulnerabilities[]/x_extensions[]',
  '/x_extensions[]',
]

/**
 * This implements the recommended test 6.2.54.3 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_54_3(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const critical =
        value && typeof value === 'object' && 'critical' in value
          ? /** @type {{ critical: boolean }} */ (value).critical
          : undefined

      if (typeof critical !== 'boolean') return

      if (critical) {
        ctx.warnings.push({
          instancePath: `${instancePath}/critical`,
          message: 'the extension must not be critical',
        })
      }
    })
  }

  return ctx
}
