import { walkPath } from '../../lib/walkPaths.js'
import { classifyExtensionSchema } from '#csaf_2_1/csafAjv/extensionSchemas/index.js'

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
 * This implements the recommended test 6.2.54.1 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_54_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const schemaUrl =
        value && typeof value === 'object' && '$schema' in value
          ? /** @type {{ $schema: String }} */ value.$schema
          : undefined

      if (typeof schemaUrl !== 'string') return

      const extensionClass = classifyExtensionSchema(schemaUrl)
      if (extensionClass !== 'registered' && extensionClass !== 'official') {
        ctx.warnings.push({
          instancePath: `${instancePath}`,
          message: 'the extension is not a registered CSAF Extension',
        })
      }
    })
  }

  return ctx
}
