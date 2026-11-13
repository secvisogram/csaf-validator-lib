import { compareZonedDateTimes } from '../../lib/shared/dateHelper.js'
import { Ajv } from 'ajv/dist/jtd.js'
import semver from 'semver'
import * as docUtils from '../../lib/mandatoryTests/shared/docUtils.js'

const ajv = new Ajv()

const revisionHistorySchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    date: { type: 'string' },
    number: { type: 'string' },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
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
              elements: revisionHistorySchema,
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */
/** @typedef {NonNullable<NonNullable<NonNullable<InputSchema['document']>['tracking']>['revision_history']>[number]} RevisionHistoryEntry */

/**
 * @typedef {{ errors: Array<{ instancePath: string; message: string }>; isValid: boolean }} Context
 */

const instancePath = '/document/tracking/revision_history'
const MAX_REPORTED_PER_GAP = 100

/**
 * This implements the mandatory test 6.1.21 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 * @returns {Context}
 */
export function mandatoryTest_6_1_21(doc) {
  /** @type {Context} */
  const ctx = { errors: [], isValid: true }

  if (!validate(doc) || !doc.document?.tracking?.revision_history) {
    return ctx
  }

  /** @type {RevisionHistoryEntry[]} */
  const revisionHistory = doc.document.tracking.revision_history

  const entries = revisionHistory
    .slice()
    .sort(
      (a, z) =>
        compareZonedDateTimes(a.date, z.date) ||
        docUtils.compareVersions(z.number, a.number)
    )
  const isSemver = entries.some((entry) => entry.number.includes('.'))

  const reported = checkMajorVersions(entries, isSemver, ctx)
  if (isSemver) {
    checkMinorAndPatchVersions(revisionHistory, reported, ctx)
  }

  return ctx
}

/**
 * @param {Context} ctx
 * @param {string} message
 */
function addError(ctx, message) {
  ctx.isValid = false
  ctx.errors.push({ instancePath, message })
}

/**
 * Reports a wrong first version and missing major versions.
 *
 * @param {RevisionHistoryEntry[]} entries sorted by date
 * @param {boolean} isSemver
 * @param {Context} ctx
 * @returns {Set<string>} the versions reported as missing
 */
function checkMajorVersions(entries, isSemver, ctx) {
  /**
   * Missing major versions by major. `found` is set if the version shows up
   * later in the list, `beforeFirst` if it is missing before the first entry.
   *
   * @type {Map<number, { found: boolean; beforeFirst: boolean; from: string; to: string }>}
   */
  const missingVersions = new Map()

  /**
   * @param {number} major
   * @param {{ beforeFirst?: boolean; from?: string; to?: string }} info
   */
  const addMissing = (major, info) => {
    missingVersions.set(major, {
      found: false,
      beforeFirst: false,
      from: '',
      to: '',
      ...info,
    })
  }

  let omitted = false
  /**
   * Adds the majors in `[start, end)`, at most `MAX_REPORTED_PER_GAP` of them.
   *
   * @param {number} start
   * @param {number} end
   * @param {{ beforeFirst?: boolean; from?: string; to?: string }} info
   */
  const addMissingRange = (start, end, info) => {
    const cappedEnd = Math.min(end, start + MAX_REPORTED_PER_GAP)
    for (let m = start; m < cappedEnd; m++) addMissing(m, info)
    if (cappedEnd < end) omitted = true
  }

  let sawLowerVersionAfterFirst = false
  /** @type {RevisionHistoryEntry | undefined} */
  let previous
  let previousMajor = 0

  for (const entry of entries) {
    const major = Number.parseInt(entry.number, 10)
    // Invalid version numbers are ignored as the schema test will fail.
    if (Number.isNaN(major)) continue

    if (!previous) {
      if (major !== 0 && major !== 1) {
        const expected = isSemver ? '`0.y.z` or `1.0.0`' : '`0` or `1`'
        addError(
          ctx,
          `revision history does not start with a version of ${expected} when sorted by date (was \`${entry.number}\`)`
        )
        addMissingRange(1, major, { beforeFirst: true, to: entry.date })
      }
    } else if (major < previousMajor) {
      // A lower major after a higher one (e.g. 3, 1, 2) may have been missing before.
      sawLowerVersionAfterFirst = true
      const missing = missingVersions.get(major)
      if (missing) {
        missing.found = true
      } else {
        addMissing(major, { to: previous.date })
      }
      continue
    } else if (major === previousMajor) {
      continue
    } else {
      addMissingRange(previousMajor + 1, major, {
        from: previous.date,
        to: entry.date,
      })
    }

    previous = entry
    previousMajor = major
  }

  /** @type {Set<string>} */
  const reported = new Set()
  for (const [major, missing] of missingVersions) {
    const { from, to } = missing
    let messageEnding = 'at all'

    if (missing.found) {
      messageEnding = from
        ? `between \`${from}\` and \`${to}\``
        : `before \`${to}\``
    } else if (missing.beforeFirst && sawLowerVersionAfterFirst) {
      // Initially missing versions are reported as missing before the first
      // entry if a lower version is encountered later, even if never found.
      messageEnding = `before \`${to}\``
    }

    const version = isSemver ? `${major}.0.0` : `${major}`
    reported.add(version)
    addError(
      ctx,
      `missing revision history item with number \`${version}\` ${messageEnding}`
    )
  }

  if (omitted) {
    addError(ctx, 'further major versions are missing in the revision history')
  }
  return reported
}

/**
 * Reports missing minor and patch versions. Minor and patch versions may end
 * at any point if the next version has a higher major respectively minor
 * version. Missing major versions are handled by `checkMajorVersions`.
 *
 * @param {RevisionHistoryEntry[]} revisionHistory
 * @param {Set<string>} alreadyReported versions reported by `checkMajorVersions`
 * @param {Context} ctx
 */
function checkMinorAndPatchVersions(revisionHistory, alreadyReported, ctx) {
  const entries = revisionHistory
    .flatMap(({ date, number }) => {
      // Values that are neither an integer nor a valid semantic version are ignored.
      const version = semver.parse(
        /^\d+$/.test(number) ? `${number}.0.0` : number
      )
      return version ? [{ date, version }] : []
    })
    .sort(
      (a, z) =>
        compareZonedDateTimes(a.date, z.date) ||
        semver.compare(a.version, z.version)
    )

  const known = new Set([
    ...entries.map(({ version }) => version.version),
    ...alreadyReported,
  ])

  let previous = entries[0]
  for (const current of entries.slice(1)) {
    if (semver.lte(current.version, previous.version)) continue

    let reported = 0
    let truncated = false
    for (const version of requiredVersions(previous.version, current.version)) {
      if (
        !(
          semver.gt(version, previous.version) &&
          semver.lt(version, current.version)
        ) ||
        known.has(version)
      ) {
        continue
      }
      if (reported >= MAX_REPORTED_PER_GAP) {
        truncated = true
        break
      }
      reported++
      known.add(version)
      addError(
        ctx,
        `missing revision history item with number \`${version}\` between \`${previous.date}\` and \`${current.date}\``
      )
    }
    if (truncated) {
      addError(
        ctx,
        `further revision history items are missing between \`${previous.date}\` and \`${current.date}\``
      )
    }
    previous = current
  }
}

/**
 * Lazily yields the versions of the same major version as `to` that have to
 * precede it and are not older than `from`: `X.0.0`, `X.1.0` ... `X.Y.0` and
 * `X.Y.0` ... `X.Y.(Z-1)`.
 *
 * @param {semver.SemVer} from
 * @param {semver.SemVer} to
 * @returns {Generator<string>}
 */
function* requiredVersions(from, to) {
  const { major, minor, patch } = to
  const startMinor = from.major === major ? from.minor : 0
  for (let m = startMinor; m <= minor; m++) {
    yield `${major}.${m}.0`
  }
  const startPatch =
    from.major === major && from.minor === minor ? from.patch : 0
  for (let p = startPatch; p < patch; p++) {
    yield `${major}.${minor}.${p}`
  }
}
