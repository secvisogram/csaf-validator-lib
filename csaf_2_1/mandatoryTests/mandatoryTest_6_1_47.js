import Ajv from 'ajv/dist/jtd.js'

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
    document: {
      additionalProperties: true,
      properties: {
        tracking: {
          additionalProperties: true,
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cve: { type: 'string' },
          ids: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                text: { type: 'string' },
              },
            },
          },
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  properties: {
                    ssvc_v1: {
                      additionalProperties: true,
                      properties: {
                        id: { type: 'string' },
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
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the mandatory test 6.1.47 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_47(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const ssvcId = metric.content?.ssvc_v1.id
      if (ssvcId === doc.document.tracking.id) {
        if (doc.vulnerabilities.length > 1) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/id`,
            message: `the ssvc id equals the 'document/tracking/id' 
              even the csaf document has multiple vulnerabilities `,
          })
        }
      } else {
        const idTexts = vulnerability.ids?.map((id) => id.text)
        if (ssvcId !== vulnerability.cve && !idTexts?.includes(ssvcId)) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/id`,
            message: `the ssvc id does neither match the 'cve' 
              nor it matches the 'text' of any item in the 'ids' array`,
          })
        }
      }
    })
  })

  return ctx
}
