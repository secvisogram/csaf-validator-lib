import { Ajv } from 'ajv/dist/jtd.js'
import csafAjv from '../csafAjv.js'
import bcpLanguageTagChecker from '../../lib/shared/bcpLanguageTagChecker.js'
import { getSsvcNamespaceLanguageTags } from '../shared/ssvcNamespaces.js'

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
                      properties: {},
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

const validate_ssvc_v2 = csafAjv.compile({
  $ref: 'https://certcc.github.io/SSVC/data/schema/v2/SelectionList_2_0_0.schema.json',
})

/**
 * This implements the mandatory test 6.1.46 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_46(doc) {
  /*
  The `ctx` variable holds the state that is accumulated during the test ran and is
  finally returned by the function.
 */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      if (metric.content?.ssvc_v2) {
        const valid = validate_ssvc_v2(metric.content.ssvc_v2)
        if (!valid) {
          ctx.isValid = false
          for (const err of validate_ssvc_v2.errors ?? []) {
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2${err.instancePath}`,
              message: err.message ?? '',
            })
          }
        }

        metric.content.ssvc_v2.selections?.forEach(
          (selection, selectionIndex) => {
            const namespace = selection.namespace
            if (typeof namespace !== 'string') {
              return
            }
            for (const languageTag of getSsvcNamespaceLanguageTags(namespace)) {
              if (!bcpLanguageTagChecker(languageTag)) {
                ctx.isValid = false
                ctx.errors.push({
                  instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${selectionIndex}/namespace`,
                  message: `the namespace contains the language tag "${languageTag}", which is not a valid language-tag`,
                })
              }
            }
          }
        )
      }
    })
  })

  return ctx
}
