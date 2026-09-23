import { Ajv } from 'ajv/dist/jtd.js'
import { isRegisteredSsvcNamespace } from '../shared/ssvcNamespaces.js'

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
                        decision_point_resources: {
                          elements: {
                            additionalProperties: true,
                            optionalProperties: {
                              summary: { type: 'string' },
                            },
                          },
                        },
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
 * This implements the recommended test 6.2.37 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_37(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const ssvc_v2 = metric.content?.ssvc_v2
      if (!ssvc_v2) return

      const selections = ssvc_v2.selections ?? []
      const resources = ssvc_v2.decision_point_resources ?? []

      /** @type {Set<string>} */
      const unregisteredNamespaces = new Set()
      selections.forEach((selection) => {
        if (
          selection?.namespace &&
          !isRegisteredSsvcNamespace(selection.namespace)
        ) {
          unregisteredNamespaces.add(selection.namespace)
        }
      })

      unregisteredNamespaces.forEach((namespace) => {
        const hasResource = resources.some((resource) =>
          resource?.summary?.includes(namespace)
        )
        if (!hasResource) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/decision_point_resources`,
            message: `The namespace "${namespace}" is not registered and no entry in decision_point_resources has a summary containing the full namespace`,
          })
        }
      })
    })
  })

  return context
}
