import { Ajv } from 'ajv/dist/jtd.js'
import { hasSsvcNamespaceExtension } from '../shared/ssvcNamespaces.js'

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
  },
  optionalProperties: {
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
 * This test checks if the document is not labeled TLP:CLEAR
 * and if any of the vulnerabilities metrics content ssvc_v2 selections namespace uses an extension.
 * If both conditions are met, it adds an info message to the context.
 *
 * @param {unknown} doc
 */
export function informativeTest_6_3_15(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (doc.document.distribution.tlp.label === 'CLEAR') {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      metric.content?.ssvc_v2?.selections?.forEach(
        (selection, selectionIndex) => {
          if (
            typeof selection.namespace === 'string' &&
            hasSsvcNamespaceExtension(selection.namespace)
          ) {
            ctx.infos.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
              message:
                'namespace uses an extension and document is not labeled TLP:CLEAR',
            })
          }
        }
      )
    })
  })

  return ctx
}
