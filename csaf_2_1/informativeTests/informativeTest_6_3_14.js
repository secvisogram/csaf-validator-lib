import { Ajv } from 'ajv/dist/jtd.js'
import { isRegisteredSsvcNamespace } from '#csaf_2_1/shared/ssvcNamespaces.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        distribution: {
          additionalProperties: true,
          optionalProperties: {
            tlp: {
              additionalProperties: true,
              optionalProperties: {
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
                    ssvc_v2: {
                      additionalProperties: true,
                      optionalProperties: {
                        selections: {
                          elements: {
                            additionalProperties: true,
                            optionalProperties: {
                              namespace: { type: 'string' },
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

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the informative test 6.3.14 of the CSAF 2.1 standard.
 *
 * For each decision point, it SHALL be tested that the namespace is not an
 * unregistered one if the document is not labeled TLP:CLEAR.
 *
 * @param {unknown} doc
 * @returns {{ infos: Array<{ message: string; instancePath: string }> }}
 */
export function informativeTest_6_3_14(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (doc.document?.distribution?.tlp?.label === 'CLEAR') {
    return ctx
  }

  const vulnerabilities = doc.vulnerabilities

  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v2?.selections
      if (!selections) return
      selections.forEach((selection, selectionIndex) => {
        if (!selection.namespace) return
        if (!isRegisteredSsvcNamespace(selection.namespace)) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
            message: `SSVC decision point namespace "${selection.namespace}" is unregistered and the document is not labeled TLP:CLEAR`,
          })
        }
      })
    })
  })

  return ctx
}
