/** @type {Promise<typeof import('@csaf-rs/vers-rs')> | undefined} */
let loading

/** @type {typeof import('@csaf-rs/vers-rs') | undefined} */
let versRs

/**
 * Loads the WebAssembly module of vers-rs. Must be awaited once before
 * `isValidVers` or `versRangesOverlap` are used.
 *
 * @returns {Promise<void>}
 */
export async function initVers() {
  loading ??= import('@csaf-rs/vers-rs')
  versRs = await loading
}

/**
 * @typedef {{ versioning_scheme: string, constraints: { comparator: string, version: string }[] }} ParsedVers
 */

/**
 * Parses a product version range in the VERS syntax (e.g. vers:semver/>2.1.0|<4.2.0)
 * using vers-rs.
 *
 * @param {string} range
 * @returns {ParsedVers | undefined} `undefined` if the range is not valid VERS
 */
function parseVers(range) {
  try {
    return /** @type {ParsedVers} */ (
      /** @type {unknown} */ (versRs?.parse(range.trim()))
    )
  } catch {
    return undefined
  }
}

/**
 * Checks whether a product version range is well-formed VERS and uses a
 * versioning scheme supported by vers-rs.
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isValidVers(range) {
  return parseVers(range) !== undefined
}

/**
 * Returns a version that is greater than Version but smaller than any
 * other version that is greater than Version and appears as a boundary
 * in a range, so that it represents the gap behind Version.
 *
 * @param {string} scheme
 * @param {string} version
 * @returns {string}
 */
function successor(scheme, version) {
  if (scheme === 'deb') return `${version}+`
  const core = version.split('+')[0]
  if (core.includes('-')) return `${core}.0`
  const [major, minor, patch] = core.split('.').map(Number)
  return `${major}.${minor}.${patch + 1}-0`
}

/**
 * Returns a version that is smaller than every other version.
 *
 * @param {string} scheme
 */
function lowest(scheme) {
  return scheme === 'deb' ? '0~' : '0.0.0-0'
}

/**
 * Checks whether `version` is within `range`. The range is parsed again for
 * each call because `contains` consumes the parsed range.
 *
 * @param {string} range
 * @param {string} version
 */
function inRange(range, version) {
  return /** @type {typeof import('@csaf-rs/vers-rs')} */ (versRs).contains(
    /** @type {any} */ (versRs?.parse(range.trim())),
    version
  )
}

/**
 * Determines whether two product version ranges in the VERS syntax
 * (e.g. vers:semver/>2.1.0|<4.2.0) overlap, i.e. whether at least one
 * version exists that is in both ranges.
 *
 * The check is based on vers-rs: every boundary version of both ranges, the
 * gap behind it and the gap before the first boundary is probed.
 *
 * Ranges of different versioning schemes never overlap. If a range is not
 * valid VERS, `false` is returned so that no false positives are reported.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function versRangesOverlap(a, b) {
  const rangeA = parseVers(a)
  const rangeB = parseVers(b)
  if (!rangeA || !rangeB) return false
  const scheme = rangeA.versioning_scheme
  if (scheme !== rangeB.versioning_scheme) return false

  const boundaries = [...rangeA.constraints, ...rangeB.constraints].map(
    (c) => c.version
  )
  const candidates = [
    lowest(scheme),
    ...boundaries.flatMap((version) => [version, successor(scheme, version)]),
  ]

  return candidates.some((version) => {
    try {
      return inRange(a, version) && inRange(b, version)
    } catch {
      return false
    }
  })
}
