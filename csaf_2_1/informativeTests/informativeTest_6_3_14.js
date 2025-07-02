import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/**
 * @typedef {object} Selection
 * @property {string} [name]
 * @property {string} [namespace]
 * @property {string} [version]
 */

/**
 * @typedef {object} Ssvc1
 * @property {Array<Selection>} [selections]
 */

/**
 * @typedef {object} MetricContent
 * @property {Ssvc1} [ssvc_v1]
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
 * @param {string | undefined } namespace
 */
function isPrivateNamespace(namespace) {
  return namespace ? namespace.startsWith('x_') : false
}

/**
 * or each SSVC decision point given under selections,
 * it MUST be tested the namespace is not a private one
 * if the document is not labeled TLP:CLEAR.
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
    /** @type {Array<Metric> | undefined} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      const selections = metric?.content?.ssvc_v1?.selections
      selections?.forEach((selection, selectionIndex) => {
        if (
          isPrivateNamespace(selection.namespace) &&
          doc.document.distribution.tlp.label !== 'TLP:CLEAR'
        ) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}/namespace`,
            message: `namespace is  private and document is not labeled TLP:CLEAR`,
          })
        }
      })
    })
  })

  return ctx
}
