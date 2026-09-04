import { Ajv } from 'ajv/dist/jtd.js'
import { isRegisteredSsvcNamespace } from '#csaf_2_1/shared/ssvcNamespaces.js'

const ajv = new Ajv()

/**
 * @typedef {object} Selection
 * @property {string} [name]
 * @property {string} [namespace]
 * @property {string} [version]
 */

/**
 * @typedef {object} Ssvc2
 * @property {Array<Selection>} [selections]
 */

/**
 * @typedef {object} MetricContent
 * @property {Ssvc2} [ssvc_v2]
 */

/**
 * @typedef {object} Metric
 * @property {MetricContent} [content]
 */

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {},
      optionalProperties: {
        distribution: {
          additionalProperties: true,
          properties: {},
          optionalProperties: {
            tlp: {
              additionalProperties: true,
              properties: {},
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
                              name: { type: 'string' },
                              namespace: { type: 'string' },
                              version: { type: 'string' },
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
 * For each SSVC decision point given under `selections`, it MUST be tested that the base `namespace` is not an unregistered one
 * if the document is not labeled `TLP:CLEAR`.
 * Namespaces reserved for special purpose MUST be treated as per their definition.
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_14(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const vulnerabilities = doc.vulnerabilities

  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v2?.selections
      if (!selections) return
      selections.forEach((selection, selectionIndex) => {
        if (!selection.namespace) return
        if (
          !isRegisteredSsvcNamespace(selection.namespace) &&
          doc.document?.distribution?.tlp?.label !== 'CLEAR'
        ) {
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
