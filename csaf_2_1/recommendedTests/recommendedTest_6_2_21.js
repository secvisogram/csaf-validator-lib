import Ajv from 'ajv/dist/jtd.js'
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
                optionalProperties: {
                  date: { type: 'string' },
                  number: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export function recommendedTest_6_2_21(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  // Since the revision_history items are optionalProperties we have to filter here on undefined ones
  // to be able to access the elements of the allDatesInRevisionHistory array later
  // without further checking if its entries are undefined.
  const revisionHistoryWithoutUndefinedDates =
    doc.document.tracking.revision_history.filter(
      (item) => item.date !== undefined
    )
  for (let i = 0; i < revisionHistoryWithoutUndefinedDates.length - 1; i++) {
    for (let j = i + 1; j < revisionHistoryWithoutUndefinedDates.length; j++) {
      if (
        compareZonedDateTimes(
          /**@type {string} */ (revisionHistoryWithoutUndefinedDates[i].date),
          /** @type {string} */ (revisionHistoryWithoutUndefinedDates[j].date)
        ) === 0
      ) {
        warnings.push({
          instancePath: `/document/tracking/revision_history/${j}/date`,
          message:
            `the timestamps of the revision history items with version number ` +
            `${revisionHistoryWithoutUndefinedDates[i].number} ` +
            `and ${revisionHistoryWithoutUndefinedDates[j].number} are equal`,
        })
      }
    }
  }

  return context
}
