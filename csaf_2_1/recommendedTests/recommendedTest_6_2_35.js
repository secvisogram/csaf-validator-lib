import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        distribution: {
          additionalProperties: true,
          properties: {
            tlp: {
              additionalProperties: true,
              properties: {
                label: { type: 'string' },
              },
            },
          },
        },
      },
    },
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
                    ssvc_v1: {
                      additionalProperties: true,
                      optionalProperties: {
                        selections: {
                          elements: {
                            additionalProperties: true,
                            optionalProperties: {
                              namespace: {
                                type: 'string',
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
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.35 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_35(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  /*
   * According to https://certcc.github.io/SSVC/data/schema/v1/Decision_Point-1-0-1.schema.json#/$defs/decision_point/properties/namespace
   * a private namespace starts with "x_"
   * */

  if (doc.document.distribution.tlp.label !== 'CLEAR') {
    return context
  }
  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v1?.selections || []
      selections.forEach((selection, selectionIndex) => {
        if (selection.namespace?.startsWith('x_')) {
          context.warnings.push({
            message: `The namespace "${selection.namespace}" is a private namespace`,
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}/namespace`,
          })
        }
      })
    })
  })

  return context
}
