const addFormats = require('ajv-formats').default
const Ajv2020 = require('ajv/dist/2020').default
const schema = require('./csaf_2_0_strict/schema.json')
const cvss_v2_0 = require('./shared/cvss-v2.0.json')
const cvss_v3_0 = require('./shared/cvss-v3.0.json')
const cvss_v3_1 = require('./shared/cvss-v3.1.json')

const ajv = new Ajv2020({ strict: false, allErrors: true })
addFormats(ajv)
ajv.addSchema(cvss_v2_0, 'https://www.first.org/cvss/cvss-v2.0.json')
ajv.addSchema(cvss_v3_0, 'https://www.first.org/cvss/cvss-v3.0.json')
ajv.addSchema(cvss_v3_1, 'https://www.first.org/cvss/cvss-v3.1.json')

const validate = ajv.compile(schema)

/**
 * @param {any} doc
 */
module.exports = function (doc) {
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
