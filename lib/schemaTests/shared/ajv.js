const addFormats = require('ajv-formats').default
const Ajv2020 = require('ajv/dist/2020').default
const cvss_v2_0 = require('./ajv/cvss-v2.0.json')
const cvss_v3_0 = require('./ajv/cvss-v3.0.json')
const cvss_v3_1 = require('./ajv/cvss-v3.1.json')

const ajv = new Ajv2020({ strict: false, allErrors: true })
addFormats(ajv)
ajv.addSchema(cvss_v2_0, 'https://www.first.org/cvss/cvss-v2.0.json')
ajv.addSchema(cvss_v3_0, 'https://www.first.org/cvss/cvss-v3.0.json')
ajv.addSchema(cvss_v3_1, 'https://www.first.org/cvss/cvss-v3.1.json')

module.exports = ajv
