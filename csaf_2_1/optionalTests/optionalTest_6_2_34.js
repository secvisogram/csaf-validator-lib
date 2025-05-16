import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
          metrics: {
            elements: {
              additionalProperties: true,
              properties: {
                content: {
                  additionalProperties: true,
                  properties: {
                    ssvc_v1: {
                      additionalProperties: true,
                      properties: {
                        selections: {
                          elements: {
                            additionalProperties: true,
                            properties: {
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
 * This implements the optional test 6.2.33 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function optionalTest_6_2_34(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  /*
   * The list of registered namespaces is according to:
   * https://certcc.github.io/SSVC/data/schema/v1/Decision_Point-1-0-1.schema.json#/$defs/decision_point/properties/namespace
   * */
  const registeredSsvcNamespaces = ['ssvc', 'cvss']

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics.forEach((metric, metricIndex) => {
      const selections = metric.content.ssvc_v1.selections
      selections.forEach((selection, selectionIndex) => {
        if (!registeredSsvcNamespaces.includes(selection.namespace)) {
          context.warnings.push({
            message: `The  used namespace "${selection.namespace}" is not a registered namespace`,
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}/namespace`,
          })
        }
      })
    })
  })

  return context
}
