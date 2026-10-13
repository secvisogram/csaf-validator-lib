// TODO: In the future, this code should be covered by the vers-like-specifier repository and can then be removed: https://github.com/csaf-rs/vers-like-specifier

const CONSTRAINT = /^(<=|>=|!=|<|>|=)?\s*([^<>=!|*\s]+)$/

/**
 * @typedef {{ op: '<' | '<=' | '>' | '>=' | '!=' | '=', version: string }} Constraint
 */

/**
 * Parses a product version range in the legacy "vls" syntax.
 *
 * @param {string} range
 * @returns {Constraint[] | undefined} `undefined` if the range is not valid vls
 */
function parseVls(range) {
  if (/^\s*vers:/.test(range)) return undefined
  /** @type {Constraint[]} */
  const constraints = []
  for (const part of range.split('|')) {
    const match = CONSTRAINT.exec(part.trim())
    if (!match || !/[a-z0-9]/i.test(match[2])) return undefined
    constraints.push({
      op: /** @type {Constraint['op']} */ (match[1] ?? '='),
      version: match[2],
    })
  }
  return constraints
}

/**
 * Checks whether a product version range is well-formed "vls".
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isValidVls(range) {
  return parseVls(range) !== undefined
}

/**
 * Best-effort comparison of two versions of unknown scheme. Versions are
 * split into numeric and alphabetic segments. Numeric segments are compared
 * numerically, alphabetic ones lexicographically (case-insensitive). A
 * missing numeric segment counts as `0`, a missing segment compared to an
 * alphabetic one is smaller (`10.9` < `10.9a`).
 *
 * @param {string} a
 * @param {string} b
 * @returns {number | undefined} `undefined` if the versions are not comparable
 */
function compareVersions(a, b) {
  const segmentsA = a.match(/\d+|[a-z]+/gi) ?? []
  const segmentsB = b.match(/\d+|[a-z]+/gi) ?? []
  const length = Math.max(segmentsA.length, segmentsB.length)

  for (let i = 0; i < length; i++) {
    const segmentA = segmentsA[i]
    const segmentB = segmentsB[i]
    const numericA = segmentA === undefined || /^\d/.test(segmentA)
    const numericB = segmentB === undefined || /^\d/.test(segmentB)

    if (segmentA === undefined && !numericB) return -1
    if (segmentB === undefined && !numericA) return 1
    if (numericA !== numericB) return undefined

    let result
    if (numericA) {
      result = Math.sign(Number(segmentA ?? 0) - Number(segmentB ?? 0))
    } else {
      const lowerA = segmentA.toLowerCase()
      const lowerB = segmentB.toLowerCase()
      result = lowerA < lowerB ? -1 : lowerA > lowerB ? 1 : 0
    }
    if (result !== 0) return result
  }
  return 0
}

/**
 * Sorts and deduplicates versions.
 *
 * @param {string[]} versions
 * @returns {string[] | undefined} `undefined` if any two versions are not comparable
 */
function sortVersions(versions) {
  for (let i = 0; i < versions.length; i++) {
    for (let j = i + 1; j < versions.length; j++) {
      if (compareVersions(versions[i], versions[j]) === undefined) {
        return undefined
      }
    }
  }
  const sorted = [...versions].sort(
    (a, b) => /** @type {number} */ (compareVersions(a, b))
  )
  return sorted.filter(
    (version, i) => i === 0 || compareVersions(sorted[i - 1], version) !== 0
  )
}

/**
 * Checks whether the position `position` on the version line satisfies the
 * constraint. The line consists of alternating gaps and points: the point of
 * boundary `k` is at position `2k + 1`, gaps are at even positions.
 *
 * @param {Constraint} constraint
 * @param {string[]} boundaries sorted boundary versions
 * @param {number} position
 */
function satisfies({ op, version }, boundaries, position) {
  const point =
    2 * boundaries.findIndex((b) => compareVersions(b, version) === 0) + 1
  switch (op) {
    case '<':
      return position < point
    case '<=':
      return position <= point
    case '>':
      return position > point
    case '>=':
      return position >= point
    case '=':
      return position === point
    case '!=':
      return position !== point
  }
}

/**
 * Evaluates whether a position on the version line is within the range.
 * Lower bounds (`>`, `>=`) paired with the following upper bound (`<`, `<=`)
 * form intervals; a leading lone upper bound starts at negative infinity and
 * a trailing lone lower bound ends at positive infinity.
 *
 * @param {Constraint[]} constraints
 * @param {string[]} boundaries
 * @param {number} position
 */
function inRange(constraints, boundaries, position) {
  const sat = (/** @type {Constraint} */ c) =>
    satisfies(c, boundaries, position)

  if (constraints.some((c) => c.op === '!=' && !sat(c))) return false
  if (constraints.some((c) => c.op === '=' && sat(c))) return true

  const bounds = constraints
    .filter((c) => c.op !== '=' && c.op !== '!=')
    .sort(
      (a, b) => /** @type {number} */ (compareVersions(a.version, b.version))
    )
  if (bounds.length === 0) {
    return constraints.every((c) => c.op === '!=')
  }

  /** @type {Constraint | undefined} */
  let lower
  for (const bound of bounds) {
    if (bound.op === '>' || bound.op === '>=') {
      lower = bound
    } else {
      if ((!lower || sat(lower)) && sat(bound)) return true
      lower = undefined
    }
  }
  return lower !== undefined && sat(lower)
}

/**
 * Determines whether two product version ranges in the legacy "vls" syntax
 * (e.g. `>2.1.0|<4.2.0`) overlap, i.e. whether at least one version exists
 * that is in both ranges.
 *
 * This is a best-effort implementation: the versions have no known scheme.
 * If a range is not valid vls or the versions cannot be compared with each
 * other, `false` is returned so that no false positives are reported.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function vlsRangesOverlap(a, b) {
  const constraintsA = parseVls(a)
  const constraintsB = parseVls(b)
  if (!constraintsA || !constraintsB) return false

  const boundaries = sortVersions(
    [...constraintsA, ...constraintsB].map((c) => c.version)
  )
  if (!boundaries) return false

  for (let position = 0; position <= 2 * boundaries.length; position++) {
    if (
      inRange(constraintsA, boundaries, position) &&
      inRange(constraintsB, boundaries, position)
    ) {
      return true
    }
  }
  return false
}
