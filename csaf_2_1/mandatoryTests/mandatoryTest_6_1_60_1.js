import { walkPath } from '../../lib/walkPaths.js'
import csafAjv from '../csafAjv.js'

const X_EXTENSIONS_PATHS /** @type {string[]} */ = [
  '/document/x_extensions[]',
  '/product_tree/branches[*]/product/x_extensions[]',
  '/product_tree/full_product_names[]/x_extensions[]',
  '/product_tree/product_paths[]/full_product_name/x_extensions[]',
  '/vulnerabilities[]/metrics[]/content/x_extensions[]',
  '/vulnerabilities[]/x_extensions[]',
  '/x_extensions[]',
]

const validateExtensionContent = csafAjv.getSchema(
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/extension-content.json'
)

/**
 * This implements the mandatory test 6.1.60.1 of the CSAF 2.1 standard.
 *
 *
 * @param {unknown} doc
 */
export async function mandatoryTest_6_1_60_1(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (typeof validateExtensionContent !== 'function') return ctx

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (!validateExtensionContent(value)) {
        ctx.isValid = false
        const ajvErrors = validateExtensionContent.errors ?? []
        ajvErrors.forEach((err) => {
          ctx.errors.push({
            instancePath: `${instancePath}${err.instancePath}`,
            message: err.message ?? 'invalid extension content',
          })
        })
      }
    })
  }

  return ctx
}
