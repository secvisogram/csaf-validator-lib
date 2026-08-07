import semver from 'semver'
import { Ajv } from 'ajv/dist/jtd.js'
import { compareZonedDateTimes } from '../dateHelper.js'

const { gt, valid } = semver

const ajv = new Ajv()

const revisionHistoryEntrySchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    date: { type: 'string' },
    number: { type: 'string' },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            revision_history: {
              elements: revisionHistoryEntrySchema,
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof revisionHistoryEntrySchema>} RevisionHistoryEntry
 */

/**
 * Maps `number` to a value comparable with semver. Integer version numbers
 * are mapped to semantic versioning by appending `.0.0`.
 *
 * @param {string} number
 * @returns {string | null}
 */
const toComparableSemver = (number) => {
  if (valid(number)) return number
  return /^\d+$/.test(number) ? `${number}.0.0` : null
}

/**
 * @param {RevisionHistoryEntry} a
 * @param {RevisionHistoryEntry} b
 * @returns {number}
 */
const compareEntries = (a, b) => {
  const dateComparison = compareZonedDateTimes(a.date, b.date)
  if (dateComparison !== 0) {
    return dateComparison
  }

  const aVersion = toComparableSemver(a.number)
  const bVersion = toComparableSemver(b.number)
  if (aVersion === null || bVersion === null) {
    return 0
  }
  return semver.compare(aVersion, bVersion)
}

/**
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_14(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (
    !validate(doc) ||
    !Array.isArray(doc.document?.tracking?.revision_history)
  ) {
    return ctx
  }

  const sortedNumbers = doc.document.tracking.revision_history
    .slice()
    .sort(compareEntries)
    .map((entry) => toComparableSemver(entry.number))
    .filter(/** @returns {n is string} */ (n) => n !== null)

  const isAscending = sortedNumbers.every(
    (number, index, all) => index === 0 || gt(number, all[index - 1])
  )

  if (!isAscending) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: `/document/tracking/revision_history`,
      message:
        'items must be in ascending order when sorted by "date" and "number"',
    })
  }

  return ctx
}
