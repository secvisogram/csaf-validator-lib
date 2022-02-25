const { valid, prerelease } = require('semver')
const {
  hasTrackingVersionField,
  hasTrackingStatusField,
  hasTrackingRevisionHistory,
} = require('./shared/docUtils')

/**
 * @param {any} doc
 */
module.exports = function mandatoryTest_6_1_19(doc) {
  let isValid = true
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []

  if (
    hasTrackingVersionField(doc) &&
    hasTrackingStatusField(doc) &&
    hasTrackingRevisionHistory(doc)
  ) {
    for (let i = 0; i < doc.document.tracking.revision_history.length; ++i) {
      const entry = doc.document.tracking.revision_history[i]
      if (valid(entry.number) && prerelease(entry.number)) {
        isValid = false
        errors.push({
          message: 'contains prerelease part',
          instancePath: `/document/tracking/revision_history/${i}/number`,
        })
      }
    }
  }

  return { errors, isValid }
}
