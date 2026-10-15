import { walkPath } from '../../lib/walkPaths.js'

/**
 * This implements the informative test 6.3.21.4 of the CSAF 2.1 standard.
 * @param {any} doc
 * @returns
 */
export async function informativeTest_6_3_21_4(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  await walkPath(
    doc,
    '/product_tree/branches[*]/product/x_extensions',
    async (instancePath) => {
      ctx.infos.push({
        instancePath,
        message:
          'The element "x_extensions" exists in a path that starts with "$.product_tree.branches".',
      })
    }
  )

  return ctx
}
