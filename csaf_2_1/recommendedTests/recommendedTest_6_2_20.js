import schema from '../schemaTests/csaf_2_1_strict/schema.js'
import csafAjv from '../csafAjv.js'

const validateStrictSchema = csafAjv.compile(schema)

/**
 * @param {unknown} doc
 */
export function recommendedTest_6_2_20(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

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

  return ctx
}
