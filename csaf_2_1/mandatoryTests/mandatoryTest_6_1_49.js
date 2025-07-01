import Ajv from 'ajv/dist/jtd.js'
import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'

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
        tracking: {
          additionalProperties: true,
          properties: {
            revision_history: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  date: { type: 'string' },
                },
              },
            },
            status: { type: 'string' },
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
                  properties: {
                    ssvc_v1: {
                      additionalProperties: true,
                      optionalProperties: {
                        timestamp: { type: 'string' },
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
 * This implements the mandatory test 6.1.49 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_49(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (
    doc.document.tracking.status === 'final' ||
    doc.document.tracking.status === 'interim'
  ) {
    const revisionHistory = doc.document.tracking.revision_history
    if (revisionHistory) {
      // sort the revision history (descending) and save the newest entry
      const newestRevisionHistoryItem = revisionHistory
        .filter((item) => item.date !== undefined)
        .sort((a, b) =>
          compareZonedDateTimes(
            /** @type {string} */ (b.date),
            /** @type {string} */ (a.date)
          )
        )[0]
      doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
        vulnerability.metrics?.forEach((metric, metricIndex) => {
          const ssvcTimestamp = metric.content?.ssvc_v1.timestamp
          if (ssvcTimestamp) {
            // compare the ssvcTimestamp with the date of the newest item in the revision history
            if (
              compareZonedDateTimes(
                ssvcTimestamp,
                /** @type {string} */ (newestRevisionHistoryItem.date)
              ) > 0
            ) {
              ctx.isValid = false
              ctx.errors.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/timestamp`,
                message:
                  `The document is in status ${doc.document.status} but the SSVC timestamp is newer ` +
                  `than the date of newest item in the revision_history`,
              })
            }
          }
        })
      })
    }
  }

  return ctx
}
