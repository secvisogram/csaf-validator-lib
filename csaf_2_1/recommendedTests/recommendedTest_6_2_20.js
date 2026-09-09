import schema from '../schemaTests/csaf_2_1_strict/schema.js'
import csafAjv from '../csafAjv.js'
import { walkPath } from '../../lib/walkPaths.js'
import { classifyExtensionSchema } from '../csafAjv/extensionSchemas/index.js'

const validateStrictSchema = csafAjv.compile(schema)

const X_EXTENSIONS_PATHS = /** @type {const} */ ([
  '/document/x_extensions[]',
  '/product_tree/branches[*]/product/x_extensions[]',
  '/product_tree/full_product_names[]/x_extensions[]',
  '/product_tree/product_paths[]/full_product_name/x_extensions[]',
  '/vulnerabilities[]/metrics[]/content/x_extensions[]',
  '/vulnerabilities[]/x_extensions[]',
  '/x_extensions[]',
])

/**
 * This implements the recommended test 6.2.20 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_20(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  // Part 1: strict schema check – report any property not defined in the CSAF schema
  if (!validateStrictSchema(doc)) {
    const additionalPropertiesErrors =
      validateStrictSchema.errors?.filter(
        (e) =>
          e.keyword === 'additionalProperties' ||
          e.keyword === 'unevaluatedProperties'
      ) ?? []
    for (const error of additionalPropertiesErrors) {
      const propertyName =
        error.params.additionalProperty ?? error.params.unevaluatedProperty
      ctx.warnings.push({
        instancePath: `${error.instancePath}/${propertyName}`,
        message: `property "${propertyName}" is not defined in the schema`,
      })
    }
  }

  // Part 2: warn about unsupported CSAF Extensions
  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const schemaUrl =
        value && typeof value === 'object' && '$schema' in value
          ? value.$schema
          : undefined

      if (typeof schemaUrl !== 'string') return

      const isSupported = typeof csafAjv.getSchema(schemaUrl) === 'function'
      if (isSupported) return

      ctx.warnings.push({
        instancePath: `${instancePath}/$schema`,
        message: `unsupported CSAF Extension of schema "${schemaUrl}" (class: ${classifyExtensionSchema(
          schemaUrl
        )})`,
      })
    })
  }

  return ctx
}
