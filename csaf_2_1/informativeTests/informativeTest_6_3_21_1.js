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
 * This implements the informative test 6.3.21.1 of the CSAF 2.1 standard.
 * @param {unknown} doc
 * @returns
 */
export async function informativeTest_6_3_21_1(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const extension = /** @type {{ category?: unknown }} */ (value)

      if (extension?.category === 'essential') {
        ctx.infos.push({
          instancePath: `${instancePath}/category`,
          message: 'extension category is essential',
        })
      }
    })
  }

  return ctx
}
