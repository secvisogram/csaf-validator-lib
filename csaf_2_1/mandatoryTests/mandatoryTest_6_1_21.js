import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'
import * as docUtils from '../../lib/mandatoryTests/shared/docUtils.js'

/**
 * @typedef {Object} RevisionHistoryEntry
 * @property {string} date
 * @property {string} number
 * @property {string} [summary]
 */

/**
 * @typedef {Object} MissingVersionMetadata
 * @property {string} version
 * @property {boolean} found
 * @property {boolean} beforeFirst
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object} MissingVersionOptions
 * @property {boolean} [found]
 * @property {boolean} [beforeFirst]
 * @property {string} [from]
 * @property {string} [to]
 */

/**
 * @param {any} doc
 * @returns {{
 *   errors: Array<{ message: string; instancePath: string }>,
 *   isValid: boolean
 * }}
 */
export function mandatoryTest_6_1_21(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []

  let isValid = true

  if (!preconditionFor_6_1_21_Matches(doc)) {
    return { errors, isValid }
  }

  const instancePath = `/document/tracking/revision_history`

  /** @type {RevisionHistoryEntry[]} */
  const revisionHistory = doc.document.tracking.revision_history

  /*
   * Keep the complete revision-history entries so that dates and the
   * original version strings remain available.
   */
  const entries = revisionHistory.slice().sort(
    (a, z) =>
      compareZonedDateTimes(a.date, z.date) ||
      // Preserve the existing ordering for entries with the same date.
      docUtils.compareVersions(z.number, a.number)
  )

  if (entries.length === 0) {
    return { errors, isValid }
  }

  const isSemver = entries.some((entry) => entry.number.includes('.'))

  /**
   * Returns the major component of a version string.
   *
   * @param {string} version
   * @returns {number | null}
   */
  const getMajor = (version) => {
    const major = Number.parseInt(version, 10)

    return Number.isNaN(major) ? null : major
  }

  /**
   * Formats a missing major version according to the version format used
   * by the revision history.
   *
   * @param {number} major
   * @returns {string}
   */
  const formatVersion = (major) => {
    return isSemver ? `${major}.0.0` : `${major}`
  }

  /**
   * Dates are retained as strings exactly as supplied by the document.
   *
   * @param {string} date
   * @returns {string}
   */
  const formatDate = (date) => {
    return String(date)
  }

  /**
   * The key is the major version because this test checks for missing
   * major revision-history items.
   *
   * @type {Map<number, MissingVersionMetadata>}
   */
  const missingVersions = new Map()

  /**
   * @param {number} major
   * @param {MissingVersionOptions} [options]
   */
  const addMissingVersion = (
    major,
    { found = false, beforeFirst = false, from = '', to = '' } = {}
  ) => {
    /*
     * Do not overwrite an earlier record. For example, a version may first
     * be identified as missing before the first entry and encountered later.
     */
    if (!missingVersions.has(major)) {
      missingVersions.set(major, {
        version: formatVersion(major),
        found,
        beforeFirst,
        from,
        to,
      })
    }
  }

  /**
   * Marks a previously missing version as found.
   *
   * @param {number} major
   * @returns {boolean}
   */
  const markVersionAsFound = (major) => {
    const missing = missingVersions.get(major)

    if (missing) {
      missing.found = true
      return true
    }

    return false
  }

  /**
   * Whether a lower version was found after the first revision-history item.
   * This is used for the project-specific handling of versions initially
   * missing before the first item.
   */
  let sawLowerVersionAfterFirst = false

  /**
   * @param {RevisionHistoryEntry} firstEntry
   */
  const addWrongFirstVersionError = (firstEntry) => {
    const correctVersion = isSemver ? '`0.y.z` or `1.0.0`' : '`0` or `1`'

    const wrongVersion = `\`${firstEntry.number}\``

    isValid = false

    errors.push({
      instancePath,
      message:
        `revision history does not start with a version of ` +
        `${correctVersion} when sorted by date ` +
        `(was ${wrongVersion})`,
    })
  }

  /** @type {RevisionHistoryEntry | null} */
  let previousEntry = null

  /** @type {number | null} */
  let previousMajor = null

  for (const currentEntry of entries) {
    const currentMajor = getMajor(currentEntry.number)

    /*
     * Invalid or non-numeric version numbers cannot participate in this
     * major-version check.
     */
    if (currentMajor === null) {
      continue
    }

    /*
     * Check the first valid revision-history item.
     */
    if (previousEntry === null) {
      if (currentMajor !== 0 && currentMajor !== 1) {
        addWrongFirstVersionError(currentEntry)

        /*
         * Add missing versions in ascending order. They are initially
         * missing before the first revision-history item.
         */
        for (let major = 1; major < currentMajor; major++) {
          addMissingVersion(major, {
            beforeFirst: true,
            to: formatDate(currentEntry.date),
          })
        }
      }

      previousEntry = currentEntry
      previousMajor = currentMajor
      continue
    }

    /*
     * A lower major version appearing later may be a version that was
     * initially marked as missing.
     *
     * Example:
     *   3, 1, 2
     */
    if (previousMajor !== null && currentMajor < previousMajor) {
      sawLowerVersionAfterFirst = true

      if (!markVersionAsFound(currentMajor)) {
        addMissingVersion(currentMajor, {
          to: formatDate(previousEntry.date),
        })
      }

      /*
       * Retain the previous higher version.
       */
      continue
    }

    /*
     * Successive entries with the same major version do not affect missing
     * major-version detection.
     */
    if (currentMajor === previousMajor || previousMajor === null) {
      continue
    }

    /*
     * At this point previousMajor is known to be non-null.
     */
    const /** @type {number} */ expectedMajor = previousMajor + 1

    /*
     * The current version is the expected next major version.
     */
    if (currentMajor === expectedMajor) {
      previousEntry = currentEntry
      previousMajor = currentMajor
      continue
    }

    /*
     * There are one or more missing versions between the previous and
     * current entries.
     *
     * Example:
     *   1 at BEFORE_DATE
     *   4 at AFTER_DATE
     *
     * Missing versions 2 and 3 receive both date boundaries.
     */
    if (currentMajor > expectedMajor) {
      for (let major = expectedMajor; major < currentMajor; major++) {
        addMissingVersion(major, {
          from: formatDate(previousEntry.date),
          to: formatDate(currentEntry.date),
        })
      }
    }

    previousEntry = currentEntry
    previousMajor = currentMajor
  }

  /*
   * Generate findings after all revision-history entries have been checked.
   */
  for (const missing of missingVersions.values()) {
    let messageEnding = 'at all'

    if (missing.found) {
      if (missing.from !== '' && missing.to !== '') {
        messageEnding = `between \`${missing.from}\` and \`${missing.to}\``
      } else if (missing.from === '' && missing.to !== '') {
        messageEnding = `before \`${missing.to}\``
      }
    } else if (
      missing.beforeFirst &&
      sawLowerVersionAfterFirst &&
      missing.from === '' &&
      missing.to !== ''
    ) {
      /*
       * If the first version skips one or more versions and a lower version
       * is encountered later, initially missing versions are reported as
       * missing before the first entry, even when that exact version was
       * never encountered later.
       */
      messageEnding = `before \`${missing.to}\``
    }

    isValid = false

    errors.push({
      instancePath,
      message:
        `missing revision history item with number ` +
        `\`${missing.version}\` ${messageEnding}`,
    })
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
