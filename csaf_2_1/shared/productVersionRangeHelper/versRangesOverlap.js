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
  loading ??= load()
  try {
    versRs = await loading
  } catch (error) {
    // do not cache a failed load so that a later call can retry
    loading = undefined
    throw error
  }
}

/**
 * @returns {Promise<typeof import('@csaf-rs/vers-rs')>}
 */
async function load() {
  if (typeof process === 'undefined' || !process.versions?.node) {
    return import('@csaf-rs/vers-rs')
  }
  // Node.js only supports importing .wasm modules natively since 22.19 / 24.5,
  // so the module is instantiated manually
  // @ts-expect-error the package ships no declaration for this internal file
  const bg = await import('@csaf-rs/vers-rs/vers_rs_bg.js')
  const { readFile } = await import(
    /* webpackIgnore: true */ 'node:fs/promises'
  )
  const wasmUrl = new URL(
    'vers_rs_bg.wasm',
    import.meta.resolve('@csaf-rs/vers-rs')
  )
  const { instance } = await WebAssembly.instantiate(await readFile(wasmUrl), {
    './vers_rs_bg.js': bg,
  })
  bg.__wbg_set_wasm(instance.exports)
  const start = /** @type {() => void} */ (instance.exports.__wbindgen_start)
  start()
  return /** @type {typeof import('@csaf-rs/vers-rs')} */ (bg)
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

/** Schemes whose versions follow MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]. */
const SEMVER_LIKE_SCHEMES = new Set(['semver', 'npm', 'cargo', 'dart'])

/**
 * Candidates for dotted numeric versions (e.g. 1.2.3): the next value of the
 * last component and a version with an additional, tiny component.
 *
 * @param {string} version
 * @returns {string[]}
 */
function dottedSuccessor(version) {
  const parts = version.split('.')
  const lastPart = parts[parts.length - 1]
  if (!/^\d+$/.test(lastPart)) return [`${version}.0`, `${version}.0.1`]
  const last = String(BigInt(lastPart) + 1n)
  return [[...parts.slice(0, -1), last].join('.'), `${version}.0.1`]
}

/**
 * For semver, cargo, npm and dart, returns versions that are greater than `version` but smaller than any other
 * version that is greater than `version` and appears as a boundary in a range,
 * so that they represent the gap behind `version`.
 *
 * @param {string} version
 * @returns {string[]}
 */
function semverSuccessor(version) {
  const core = version.split('+')[0]
  if (core.includes('-')) return [`${core}.0`]
  const [major, minor, patch] = core.split('.')
  return [
    `${major}.${minor}.${BigInt(patch) + 1n}-0`,
    `${major}.${BigInt(minor) + 1n}.0-0`,
  ]
}

/**
 * Returns versions that are greater than `version` but smaller than any other
 * version that is greater than `version` and appears as a boundary in a range,
 * so that they represent the gap behind `version`. Returns an empty array for
 * schemes without such a version.
 *
 * @param {string} scheme
 * @param {string} version
 * @returns {string[]}
 */
export function successor(scheme, version) {
  switch (scheme) {
    case 'deb':
      // dpkg splits at the last hyphen, so any hyphen means a revision is
      // present. An empty revision equals "0". Appending "A~" yields a version
      // above `version` that sorts below every "A", "+", "." or digit suffix.
      return version.includes('-')
        ? [`${version}A~`, `${version}+`]
        : [`${version}-0A~`, `${version}+`]
    case 'alpm':
    case 'rpm': {
      // rpmvercmp: a version with additional segments is newer
      return [`${version}.0`, `${version}a`, `${version}^`]
    }
    case 'apk': {
      const revision = /^(.*)-r(\d+)$/.exec(version)
      return revision
        ? [`${revision[1]}-r${BigInt(revision[2]) + 1n}`, `${version}_p1`]
        : [`${version}-r1`, `${version}_p1`]
    }
    case 'cpan': {
      if (/^v?\d+(\.\d+){2,}$/.test(version)) return dottedSuccessor(version)
      // decimal version: appending a digit yields a slightly bigger number
      return version.includes('.')
        ? [`${version}1`, `${version}001`]
        : [`${version}.000001`, `${version}.001`]
    }
    case 'composer':
    case 'hackage':
    case 'intdot':
    case 'generic':
      return dottedSuccessor(version)
    case 'gem':
      return /^\d+(\.\d+)*$/.test(version)
        ? dottedSuccessor(version)
        : [`${version}.0.1`, `${version}.1`]
    case 'maven':
      return [...dottedSuccessor(version), `${version}-sp`]
    case 'pypi': {
      // PEP 440: post-releases are above the release, dev-releases below
      // the next release
      const result = [`${version}.post0`, `${version}.post1`]
      if (/^\d+(\.\d+)*$/.test(version)) {
        const [next] = dottedSuccessor(version)
        result.push(`${next}.dev0`)
      }
      return result
    }
    case 'golang': {
      const prefix = version.startsWith('v') ? 'v' : ''
      return semverSuccessor(version.slice(prefix.length)).map(
        (v) => `${prefix}${v}`
      )
    }
    case 'nuget': {
      const core = version.split('+')[0].split('-')[0]
      return core.split('.').length === 3
        ? semverSuccessor(version)
        : [...dottedSuccessor(version.split('+')[0]), `${version}.0`]
    }
    case 'datetime': {
      const time = Date.parse(version)
      if (Number.isNaN(time)) return []
      return [1, 1000].map((ms) => new Date(time + ms).toISOString())
    }
    case 'lexicographic':
      return [`${version}\u0000`]
    case 'all':
    case 'none':
      return []
    default:
      return SEMVER_LIKE_SCHEMES.has(scheme) ? semverSuccessor(version) : []
  }
}

/**
 * Returns a version that is smaller than every other version, or `undefined`
 * if the scheme has no versions or is unknown.
 *
 * @param {string} scheme
 * @returns {string | undefined}
 */
export function lowest(scheme) {
  switch (scheme) {
    case 'deb':
      return '0~'
    case 'alpm':
    case 'cpan':
    case 'generic':
    case 'hackage':
    case 'intdot':
      return '0'
    case 'rpm':
      return '~'
    case 'apk':
      return '0_alpha'
    case 'composer':
      return '0-dev'
    case 'dart':
    case 'nuget':
      return '0.0.0-0'
    case 'gem':
      return '0.a'
    case 'golang':
      return 'v0.0.0-0'
    case 'maven':
      return '0-alpha'
    case 'pypi':
      return '0.dev0'
    case 'datetime':
      return '0000-01-01T00:00:00.000Z'
    case 'lexicographic':
      return ''
    default:
      return SEMVER_LIKE_SCHEMES.has(scheme) ? '0.0.0-0' : undefined
  }
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
  /** @type {Map<string, Map<string, boolean>>} */
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

  /** @type {Map<ParsedVers, string[]>} */
  const candidatesByRange = new Map()

  /** @param {ParsedVers} range */
  const cachedCandidates = (range) => {
    let candidates = candidatesByRange.get(range)
    if (!candidates) {
      candidates = candidateVersions(range)
      candidatesByRange.set(range, candidates)
    }
    return candidates
  }

  return (a, b) => {
    const [first, second] = a <= b ? [a, b] : [b, a]
    let bySecond = overlaps.get(first)
    if (!bySecond) {
      bySecond = new Map()
      overlaps.set(first, bySecond)
    }
    let result = bySecond.get(second)
    if (result === undefined) {
      result = computeOverlap(a, b, cachedInRange, cachedCandidates)
      bySecond.set(second, result)
    }
    return result
  }
}

/**
 * The versions to probe for a range: the lowest version of its scheme, every
 * boundary and the gap behind every boundary.
 *
 * @param {ParsedVers} range
 * @returns {string[]}
 */
function candidateVersions(range) {
  const scheme = range.versioning_scheme
  const start = lowest(scheme)
  return [
    ...new Set([
      ...(start === undefined ? [] : [start]),
      ...range.constraints.flatMap(({ version }) => {
        try {
          return [version, ...successor(scheme, version)]
        } catch {
          return [version]
        }
      }),
    ]),
  ]
}

/**
 * @param {string} a
 * @param {string} b
 * @param {(range: string, version: string) => boolean} contains
 * @param {(range: ParsedVers) => string[]} [candidatesOf]
 * @returns {boolean}
 */
function computeOverlap(a, b, contains, candidatesOf = candidateVersions) {
  const rangeA = parseVers(a)
  const rangeB = parseVers(b)
  if (!rangeA || !rangeB) return false
  if (rangeA.versioning_scheme !== rangeB.versioning_scheme) return false

  // Own range first: its membership is cached per range, so the other range
  // (a new WASM call per pair) is only asked for versions inside the own range.
  return (
    candidatesOf(rangeA).some((v) => contains(a, v) && contains(b, v)) ||
    candidatesOf(rangeB).some((v) => contains(b, v) && contains(a, v))
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
