import Ajv from 'ajv/dist/jtd.js'
import { compareZonedDateTimes } from '../dateHelper.js'
import { Temporal } from 'temporal-polyfill'

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
                optionalProperties: {
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
        optionalProperties: {
          disclosure_date: { type: 'string' },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.33 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_33(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }
  const currentTimestampUtc = Temporal.Now.zonedDateTimeISO('UTC').toString()
  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const disclosureDate = doc.vulnerabilities[i].disclosure_date
    // check if the disclosure date is in the past
    if (
      disclosureDate &&
      compareZonedDateTimes(disclosureDate, currentTimestampUtc) < 1
    ) {
      const revisionHistory = doc.document.tracking.revision_history
      // sort the revision history (ascending) so one don't need to loop through it
      // to find the date of its newest item
      revisionHistory.sort((a, b) => {
        // if both dates are undefined, consider them equal
        if (!a.date && !b.date) {
          return 0
        }
        // move undefined items to the beginning of the array
        if (!a.date) {
          return -1
        }
        if (!b.date) {
          return 1
        }

        // if both dates are not undefined, compare them
        return compareZonedDateTimes(a.date, b.date)
      })
      // compare the disclosure date with the date of the newest item of the revision history
      const newestItemInRevisionHistory =
        revisionHistory[revisionHistory.length - 1].date
      if (
        newestItemInRevisionHistory &&
        compareZonedDateTimes(disclosureDate, newestItemInRevisionHistory) > 0
      ) {
        context.warnings.push({
          message:
            'The disclosure_date is in the past but newer than the date of the newest item of the revision_history.',
          instancePath: `/vulnerabilities/${i}/disclosure_date`,
        })
      }
    }
  }

  return context
}
