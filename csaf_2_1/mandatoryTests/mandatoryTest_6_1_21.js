import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'
import * as docUtils from '../../lib/mandatoryTests/shared/docUtils.js'

/**
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_21(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  // 6.1.21 Missing Item in Revision History
  if (preconditionFor_6_1_21_Matches(doc)) {
    const sortedNumbers = Array.from(
      new Set(
        doc.document.tracking.revision_history
          .slice()
          .sort(
            (a, z) =>
              compareZonedDateTimes(
                /** @type {string} */ (a.date),
                /** @type {string} */ (z.date)
              ) || docUtils.compareVersions(z.number, a.number)
          )
          .map((e) =>
            // By using `parseInt` here we can deal with numeric and semantic versions
            parseInt(e.number)
          )
      ).keys()
    )
    if (sortedNumbers.length > 0 && ![0, 1].includes(sortedNumbers[0])) {
      isValid = false
      errors.push({
        instancePath: `/document/tracking/revision_history`,
        message: `revision history does not start with a version of 0 or 1 when sorted by date`,
      })
    } else {
      for (let i = 0; i < sortedNumbers.length; ++i) {
        const expectedVersionNumber = i + Number(sortedNumbers[0])
        if (sortedNumbers[i] > expectedVersionNumber) {
          isValid = false
          errors.push({
            instancePath: `/document/tracking/revision_history`,
            message: `major version ${expectedVersionNumber} was omitted`,
          })
          break
        }
      }
    }
  }

  return { errors, isValid }
}

/**
 * @param {any} doc
 * @returns {doc is { document: { tracking: { revision_history: Array<{ number: string; date: string }> } } }}
 */
const preconditionFor_6_1_21_Matches = (doc) =>
  Array.isArray(doc?.document?.tracking?.revision_history) &&
  doc.document.tracking.revision_history.every(
    (/** @type {any} */ r) =>
      typeof r.number === 'string' && typeof r.date === 'string'
  )
