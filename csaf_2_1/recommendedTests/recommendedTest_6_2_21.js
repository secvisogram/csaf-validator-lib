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
  const allDatesInRevisionHistory = doc.document.tracking.revision_history
    .map((item) => item.date)
    .filter((date) => date !== undefined)
  for (let i = 0; i < allDatesInRevisionHistory.length - 1; i++) {
    for (let j = i + 1; j < allDatesInRevisionHistory.length; j++) {
      if (
        compareZonedDateTimes(
          allDatesInRevisionHistory[i],
          allDatesInRevisionHistory[j]
        ) === 0
      ) {
        warnings.push({
          instancePath: `/document/tracking/revision_history/${j}/date`,
          message:
            `the timestamps of the revision history items with version number ` +
            `${doc.document.tracking.revision_history[i].number} ` +
            `and ${doc.document.tracking.revision_history[j].number} are equal`,
        })
      }
    }
  }

  return context
}
