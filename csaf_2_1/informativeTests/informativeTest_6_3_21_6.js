import { walkPath } from '../../lib/walkPaths.js'

/**
 * This implements the informative test 6.3.21.6 of the CSAF 2.1 standard.
 * @param {any} doc
 * @returns
 */
export async function informativeTest_6_3_21_6(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  await walkPath(
    doc,
    '/product_tree/product_paths[*]/full_product_name/x_extensions',
    async (instancePath) => {
      ctx.infos.push({
        instancePath,
        message:
          'The element "x_extensions" exists in the list of product paths.',
      })
    }
  )

  return ctx
}
