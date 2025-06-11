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
                properties: {
                  date: { type: 'timestamp' },
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

  const allDatesInRevisionHistory = doc.document.tracking.revision_history.map(
    (item) => item.date
  )

  for (let i = 0; i < allDatesInRevisionHistory.length - 1; i++) {
    for (let j = i + 1; j < allDatesInRevisionHistory.length; j++) {
      if (
        compareZonedDateTimes(
          /** @type {string} */ (allDatesInRevisionHistory[i]),
          /** @type {string} */ (allDatesInRevisionHistory[j])
        ) === 0
      ) {
        warnings.push({
          instancePath: `/document/tracking/revision_history/${j}/date`,
          message: `timestamps of the revision history items with version number ${doc.document.tracking.revision_history[i].number} and ${doc.document.tracking.revision_history[j].number} are equal `,
        })
      }
    }
  }

  return context
}
