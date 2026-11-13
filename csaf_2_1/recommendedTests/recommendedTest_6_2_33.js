import { Ajv } from 'ajv/dist/jtd.js'
import { compareZonedDateTimes } from '../dateHelper.js'
import { Temporal } from 'temporal-polyfill'

const ajv = new Ajv()

const revisionHistorySchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    date: { type: 'string' },
  },
})

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
              elements: revisionHistorySchema,
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

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof revisionHistorySchema>} RevisionHistorySchema
 */

/**
 * This implements the recommended test 6.2.33 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function recommendedTest_6_2_33(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }
  const currentTimestampUtc = Temporal.Now.zonedDateTimeISO('UTC').toString()

  // Sort a copy of the revision history (ascending) once, outside the vulnerability loop,
  // so one doesn't need to loop through it to find the date of its newest item.
  /** @type {RevisionHistorySchema[]} */
  const sortedRevisionHistory = [
    ...doc.document.tracking.revision_history,
  ].sort((a, b) => {
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

  if (sortedRevisionHistory.length === 0) {
    return ctx
  }

  const newestItemInRevisionHistory =
    sortedRevisionHistory[sortedRevisionHistory.length - 1].date

  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const disclosureDate = doc.vulnerabilities[i].disclosure_date
    // check if the disclosure date is in the past
    if (
      disclosureDate &&
      compareZonedDateTimes(disclosureDate, currentTimestampUtc) < 0
    ) {
      // compare the disclosure date with the date of the newest item of the revision history
      if (
        newestItemInRevisionHistory &&
        compareZonedDateTimes(disclosureDate, newestItemInRevisionHistory) > 0
      ) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${i}/disclosure_date`,
          message:
            'The disclosure_date is in the past but newer than the date of the newest item of the revision_history.',
        })
      }
    }
  }

  return ctx
}
