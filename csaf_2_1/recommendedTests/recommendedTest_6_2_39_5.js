import { walkPath } from '../../lib/walkPaths.js'

const X_EXTENSIONS_PATHS /** @type {string[]} */ = [
  '/document/x_extensions[]',
  '/x_extensions[]',
]

/**
 * This implements the recommended test 6.2.39.4.1 of the CSAF 2.1 standard.
 *
 * It MUST be tested that the document does not contain an extension when the
 * document category is `csaf_withdrawn` or `csaf_superseded`.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_39_5(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  const docCategoryCsafWithdrawn = `csaf_withdrawn`
  const docCategoryCsafSuperseded = `csaf_superseded`

  const docCategory = /** @type {{ document?: { category?: unknown } }} */ (doc)
    ?.document?.category

  if (
    docCategory !== docCategoryCsafWithdrawn &&
    docCategory !== docCategoryCsafSuperseded
  ) {
    return ctx
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath) => {
      ctx.warnings.push({
        instancePath,
        message: `for document category "${docCategory}" the document must not contain an extension`,
      })
    })
  }

  return ctx
}
