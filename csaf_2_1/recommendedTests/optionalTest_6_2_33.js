import Ajv from 'ajv/dist/jtd.js'
import { ZonedDateTime, ZoneId } from '@js-joda/core'
import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'

const ajv = new Ajv()

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
                properties: {
                  date: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
          disclosure_date: { type: 'string' },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the optional test 6.2.33 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function optionalTest_6_2_33(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }
  const currentTimestampUtc = ZonedDateTime.now(ZoneId.UTC)
  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const disclosureDate = doc.vulnerabilities[i].disclosure_date
    // check if the disclosure date is in the past
    if (compareZonedDateTimes(disclosureDate, currentTimestampUtc) < 1) {
      const revisionHistory = doc.document.tracking.revision_history
      // sort the revision history (ascending) so we don't need to loop through it
      // to find the date of its newest item
      revisionHistory.sort(
        (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
      )
      // compare the disclosure date with the date of the newest item in the revision history
      if (
        compareZonedDateTimes(
          disclosureDate,
          revisionHistory[revisionHistory.length - 1].date
        ) > 0
      ) {
        context.warnings.push({
          message:
            'The disclosure_date is in the past but newer than the date of the newest item in the revision_history.',
          instancePath: `/vulnerabilities/${i}/disclosure_date`,
        })
      }
    }
  }

  return context
}
