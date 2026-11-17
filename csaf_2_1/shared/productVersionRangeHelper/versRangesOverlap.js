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

/** @type {Map<string, ParsedVers | undefined>} */
const parseCache = new Map()

/**
 * Parses a product version range in the VERS syntax (e.g. vers:semver/>2.1.0|<4.2.0)
 * using vers-rs.
 *
 * @param {string} range
 * @returns {ParsedVers | undefined} `undefined` if the range is not valid VERS
 */
function parseVers(range) {
  const key = range.trim()
  if (parseCache.has(key)) return parseCache.get(key)
  /** @type {ParsedVers | undefined} */
  let parsed
  try {
    parsed = /** @type {ParsedVers} */ (
      /** @type {unknown} */ (versRs?.parse(key))
    )
  } catch {
    parsed = undefined
  }

  if (versRs) {
    parseCache.set(key, parsed)
  }
  return parsed
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
 * @returns {string[]}
 */
function successor(scheme, version) {
  if (scheme === 'deb') return [`${version}+`]
  if (scheme === 'intdot') {
    const parts = version.split('.')
    const last = String(BigInt(parts[parts.length - 1]) + 1n)
    return [[...parts.slice(0, -1), last].join('.'), `${version}.0.1`]
  }
  const core = version.split('+')[0]
  if (core.includes('-')) return [`${core}.0`]
  const [major, minor, patch] = core.split('.')
  return [
    `${major}.${minor}.${BigInt(patch) + 1n}-0`,
    `${major}.${BigInt(minor) + 1n}.0-0`,
  ]
}

/**
 * Returns a version that is smaller than every other version.
 *
 * @param {string} scheme
 */
function lowest(scheme) {
  if (scheme === 'deb') return '0~'
  return scheme === 'intdot' ? '0' : '0.0.0-0'
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
 * Creates a function that determines whether two product version ranges in
 * the VERS syntax (e.g. vers:semver/>2.1.0|<4.2.0) overlap, i.e. whether at
 * least one version exists that is in both ranges.
 *
 * The check is based on vers-rs: every boundary version of both ranges, the
 * gap behind it and the gap before the first boundary is probed.
 *
 * Ranges of different versioning schemes never overlap. If a range is not
 * valid VERS, `false` is returned so that no false positives are reported.
 *
 * The returned function caches results (the overlap is commutative) and the
 * membership checks of single versions, so it should be reused for many
 * comparisons.
 *
 * @returns {(a: string, b: string) => boolean}
 */
export function createVersOverlapChecker() {
  /** @type {Map<string, Map<string, boolean>>} */
  const membership = new Map()
  /** @type {Map<string, boolean>} */
  const overlaps = new Map()

  /**
   * @param {string} range
   * @param {string} version
   */
  const cachedInRange = (range, version) => {
    let byVersion = membership.get(range)
    if (!byVersion) {
      byVersion = new Map()
      membership.set(range, byVersion)
    }
    let result = byVersion.get(version)
    if (result === undefined) {
      try {
        result = inRange(range, version)
      } catch {
        result = false
      }
      byVersion.set(version, result)
    }
    return result
  }

  return (a, b) => {
    const key = a <= b ? JSON.stringify([a, b]) : JSON.stringify([b, a])
    let result = overlaps.get(key)
    if (result === undefined) {
      result = computeOverlap(a, b, cachedInRange)
      overlaps.set(key, result)
    }
    return result
  }
}

/**
 * @param {string} a
 * @param {string} b
 * @param {(range: string, version: string) => boolean} contains
 * @returns {boolean}
 */
function computeOverlap(a, b, contains) {
  const rangeA = parseVers(a)
  const rangeB = parseVers(b)
  if (!rangeA || !rangeB) return false
  const scheme = rangeA.versioning_scheme
  if (scheme !== rangeB.versioning_scheme) return false

  const boundaries = [...rangeA.constraints, ...rangeB.constraints].map(
    (c) => c.version
  )
  const candidates = new Set([
    lowest(scheme),
    ...boundaries.flatMap((version) => {
      try {
        return [version, ...successor(scheme, version)]
      } catch {
        return [version]
      }
    }),
  ])

  return [...candidates].some(
    (version) => contains(a, version) && contains(b, version)
  )
}

/**
 * Determines whether two product version ranges in the VERS syntax overlap.
 * See `createVersOverlapChecker` for a variant that caches results.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function versRangesOverlap(a, b) {
  return computeOverlap(a, b, (range, version) => {
    try {
      return inRange(range, version)
    } catch {
      return false
    }
  })
}
