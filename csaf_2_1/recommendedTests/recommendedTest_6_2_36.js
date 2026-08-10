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
 * This implements the recommended test 6.2.36 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_36(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (doc.document.distribution.tlp.label !== 'CLEAR') {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      metric.content?.ssvc_v2?.selections?.forEach(
        (selection, selectionIndex) => {
          const namespace = selection.namespace
          if (
            typeof namespace === 'string' &&
            hasSsvcNamespaceExtension(namespace)
          ) {
            ctx.warnings.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
              message:
                'the SSVC decision point namespace must not use an extension in TLP:CLEAR documents',
            })
          }
        }
      )
    })
  })

  return ctx
}
