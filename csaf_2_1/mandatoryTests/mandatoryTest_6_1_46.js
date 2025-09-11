import Ajv from 'ajv/dist/jtd.js'
import csafAjv from '../csafAjv.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
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
                    ssvc_v2: {
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

const validateInput = ajv.compile(inputSchema)

const validate_ssvc_v2 = csafAjv.compile({
  $ref: 'https://certcc.github.io/SSVC/data/schema/v2/Decision_Point_Value_Selection-2-0-0.schema.json',
})

/**
 * This implements the mandatory test 6.1.46 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_46(doc) {
  /*
  The `ctx` variable holds the state that is accumulated during the test ran and is
  finally returned by the function.
 */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      if (metric.content?.ssvc_v2) {
        const valid = validate_ssvc_v2(metric.content.ssvc_v2)
        if (!valid) {
          ctx.isValid = false
          for (const err of validate_ssvc_v2.errors ?? []) {
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2${err.instancePath}`,
              message: err.message ?? '',
            })
          }
        }
      }
    })
  })

  return ctx
}
