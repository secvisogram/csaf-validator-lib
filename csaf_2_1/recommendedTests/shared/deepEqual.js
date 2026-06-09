/**
 * Recursively compares two values for deep equality,
 * treating arrays as unordered sets and ignoring object key order.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function deepEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return arraysEqualAsSets(a, b)
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    return objectsEqual(a, b)
  }
  return a === b
}

/**
 * Compares two arrays as unordered multisets: each element in `a`
 * must have exactly one (still unused) deep-equal counterpart in `b`.
 * @param {unknown[]} a
 * @param {unknown[]} b
 */
function arraysEqualAsSets(a, b) {
  if (a.length !== b.length) return false

  const matched = new Array(b.length).fill(false)
  return a.every((itemA) => {
    const matchIndex = b.findIndex(
      (itemB, i) => !matched[i] && deepEqual(itemA, itemB)
    )
    const found = matchIndex !== -1
    if (found) matched[matchIndex] = true
    return found
  })
}

/**
 * Compares two plain objects by deep-equal values, ignoring key order.
 * @param {Record<string, unknown>} a
 * @param {Record<string, unknown>} b
 */
function objectsEqual(a, b) {
  const keysA = Object.keys(a)
  if (keysA.length !== Object.keys(b).length) return false
  return keysA.every(
    (key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key])
  )
}

/**
 * Narrows `value` to a non-null, non-array object.
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
