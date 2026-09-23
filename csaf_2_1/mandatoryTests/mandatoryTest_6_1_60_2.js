import { walkPath } from '../../lib/walkPaths.js'
import csafAjv from '../csafAjv.js'
import { classifyExtensionSchema } from '../csafAjv/extensionSchemas/index.js'

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
 * This implements the mandatory test 6.1.60.2 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function mandatoryTest_6_1_60_2(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const schemaUrl =
        value && typeof value === 'object' && '$schema' in value
          ? value.$schema
          : undefined

      if (typeof schemaUrl !== 'string') return

      // Only schemas explicitly registered on csafAjv (the allow list, see
      // csafAjv/extensionSchemas/index.js) are ever used to validate a
      // declared CSAF Extension Schema - schemas are never loaded from the
      // network at runtime (see CSAF 2.1 spec chapter 8).
      const validateDeclaredSchema = csafAjv.getSchema(schemaUrl)
      if (typeof validateDeclaredSchema !== 'function') {
        ctx.warnings.push({
          instancePath,
          message: `declared CSAF Extension Schema "${schemaUrl}" (class: ${classifyExtensionSchema(
            schemaUrl
          )}) is not supported and could not be validated`,
        })
        return
      }

      if (!validateDeclaredSchema(value)) {
        ctx.isValid = false
        validateDeclaredSchema.errors?.forEach((err) => {
          ctx.errors.push({
            instancePath: `${instancePath}${err.instancePath}`,
            message:
              err.message ??
              'invalid according to declared CSAF Extension Schema',
          })
        })
      }
    })
  }

  return ctx
}
