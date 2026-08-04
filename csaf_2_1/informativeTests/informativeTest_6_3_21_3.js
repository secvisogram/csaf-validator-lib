import { walkPath } from '../../lib/walkPaths.js'

/**
 * This implements the informative test 6.3.21.3 of the CSAF 2.1 standard.
 * @param {any} doc
 * @returns
 */
export async function informativeTest_6_3_21_3(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  await walkPath(doc, '/document/x_extensions', async (instancePath) => {
    ctx.infos.push({
      instancePath,
      message: `The element "$.document.x_extensions" exists.`,
    })
  })

  return ctx
}
