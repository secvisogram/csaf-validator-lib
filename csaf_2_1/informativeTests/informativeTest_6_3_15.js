import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const PREFIX_EXTENSION_NAMESPACE = 'x_'

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
        properties: {},
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
 * @param {string | undefined } namespace
 */
function namespaceUsesExtension(namespace) {
  return namespace ? namespace.startsWith(PREFIX_EXTENSION_NAMESPACE) : false
}

/**
 * For each SSVC decision point given under `selections`, it MUST be tested that the `namespace` does not use an extension
 * if the document is not labeled `TLP:CLEAR`.
 * Namespaces reserved for special purpose MUST be treated as per their definition.
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_15(doc) {
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
      const selections = metric?.content?.ssvc_v2?.selections
      selections?.forEach((selection, selectionIndex) => {
        if (
          namespaceUsesExtension(selection.namespace) &&
          doc.document.distribution.tlp.label !== 'TLP:CLEAR'
        ) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
            message:
              'namespace uses an extension and document is not labeled TLP:CLEAR',
          })
        }
      })
    })
  })

  return ctx
}
