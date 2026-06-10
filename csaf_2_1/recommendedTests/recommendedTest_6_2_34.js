import { Ajv } from 'ajv/dist/jtd.js'
import { isRegisteredSsvcNamespace } from '../shared/ssvcHelpers.js'

const ajv = new Ajv()

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
                      optionalProperties: {
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
 * This implements the recommended test 6.2.34 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_34(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v2?.selections
      if (!selections) return
      selections.forEach((selection, selectionIndex) => {
        if (!isRegisteredSsvcNamespace(selection.namespace)) {
          context.warnings.push({
            message: `The used namespace "${selection.namespace}" is not a registered namespace`,
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
          })
        }
      })
    })
  })

  return context
}
