const ajv = require('./shared/ajv.js')
const schema = require('./csaf_2_0_strict/schema.json')

const validate = ajv.compile(schema)

/**
 * @param {any} doc
 */
module.exports = function csaf_2_0_strict(doc) {
  let isValid = validate(doc)
  /**
   *
   * @type {Array<{
   *    message?: string
   *    instancePath: string
   *  }>}
   */
  const errors = validate.errors ?? []
  return { isValid, errors }
}
