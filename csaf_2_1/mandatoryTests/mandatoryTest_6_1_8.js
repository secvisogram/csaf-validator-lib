import { Ajv } from 'ajv/dist/jtd.js'
import { Ajv2020 } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import cvss_v2_0 from '../../schemas/cvss-v2.0.js'
import cvss_v3_0 from '../../schemas/cvss-v3.0.js'
import cvss_v3_1 from '../../schemas/cvss-v3.1.js'
import csafAjv from '../csafAjv.js'

const jtdAjv = new Ajv()

/**
  The referenced FIRST.org CVSS v2.0/v3.0/v3.1 schemas don't set
  `additionalProperties: false` at the root, so a plain `$ref` to them (as registered on
  the shared `csafAjv` used elsewhere) would silently accept unknown properties.
 */
const strictAjv = new Ajv2020({ strict: false, allErrors: true })
addFormats.default(strictAjv)

/**
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v2: {
                      additionalProperties: true,
                      properties: {},
                    },
                    cvss_v3: {
                      additionalProperties: true,
                      properties: {},
                    },
                    cvss_v4: {
                      additionalProperties: true,
                      properties: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

const validate = jtdAjv.compile(inputSchema)

const validate_2_0 = strictAjv.compile({
  ...cvss_v2_0,
  additionalProperties: false,
})

const validate_3 = strictAjv.compile({
  oneOf: [
    { ...cvss_v3_0, additionalProperties: false },
    { ...cvss_v3_1, additionalProperties: false },
  ],
})

const validate_4_0 = csafAjv.compile({
  $ref: 'https://www.first.org/cvss/cvss-v4.0.json',
})

/**
 * @param {any} doc
 */
export function mandatoryTest_6_1_8(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc)) {
    return ctx
  }

  for (const [
    vulnerabilityIndex,
    vulnerability,
  ] of doc.vulnerabilities?.entries() ?? []) {
    for (const [metricIndex, metric] of vulnerability.metrics?.entries() ??
      []) {
      if (metric?.content?.cvss_v2) {
        const valid = validate_2_0(metric?.content.cvss_v2)
        if (!valid) {
          ctx.isValid = false
          for (const err of validate_2_0.errors ?? []) {
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/cvss_v2${err.instancePath}`,
              message: err.message ?? '',
            })
          }
        }
      }
      if (metric?.content?.cvss_v3) {
        const valid = validate_3(metric?.content?.cvss_v3)
        if (!valid) {
          ctx.isValid = false
          for (const err of validate_3.errors ?? []) {
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/cvss_v3${err.instancePath}`,
              message: err.message ?? '',
            })
          }
        }
      }
      if (metric?.content?.cvss_v4) {
        const valid = validate_4_0(metric?.content?.cvss_v4)
        if (!valid) {
          ctx.isValid = false
          for (const err of validate_4_0.errors ?? []) {
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/cvss_v4${err.instancePath}`,
              message: err.message ?? '',
            })
          }
        }
      }
    }
  }

  return ctx
}
