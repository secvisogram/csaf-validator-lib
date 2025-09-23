import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/** from https://github.com/CERTCC/SSVC/blob/main/src/ssvc/namespaces.py */
const REGISTERED_NAMESPACES = [
  'ssvc',
  'cvss',
  'cisa',
  'basic',
  'example',
  'test',
]

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
function isRegisteredNamespace(namespace) {
  return namespace ? REGISTERED_NAMESPACES.includes(namespace) : false
}

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
    /** @type {Array<Metric> | undefined} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      const selections = metric?.content?.ssvc_v2?.selections
      selections?.forEach((selection, selectionIndex) => {
        if (
          !isRegisteredNamespace(selection.namespace) &&
          doc.document.distribution.tlp.label !== 'TLP:CLEAR'
        ) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
            message:
              'namespace is not an unregistered one document is not labeled TLP:CLEAR',
          })
        }
      })
    })
  })

  return ctx
}
