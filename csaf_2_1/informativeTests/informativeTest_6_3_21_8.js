import { walkPath } from '../../lib/walkPaths.js'

/**
 * This implements the informative test 6.3.21.8 of the CSAF 2.1 standard.
 * @param {any} doc
 * @returns
 */
export async function informativeTest_6_3_21_8(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  await walkPath(
    doc,
    '/vulnerabilities[*]/x_extensions',
    async (instancePath) => {
      ctx.infos.push({
        instancePath,
        message:
          'The element "x_extensions" exists inside a "vulnerabilities" item.',
      })
    }
  )

  return ctx
}
