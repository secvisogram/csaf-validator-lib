import { toTime } from '@secvisogram/is-leap-second'

/**
 * Compares two date-time strings using `toTime` from `@secvisogram/is-leap-second`.
 * Returns a negative number if `a` is less than `b`, a positive number if `a` is greater
 * than `b`, and zero if they are equal. Also returns 0 if either value cannot be parsed.
 * Follows the comparator convention used by `Array.prototype.sort`.
 *
 * @param {string} a - The first date-time string to compare.
 * @param {string} b - The second date-time string to compare.
 * @returns {0|1|-1} Negative if `a < b`, positive if `a > b`, zero if equal or unparseable.
 */
export const compareZonedDateTimes = (a, b) => {
  // catch TypeError exception if a or b can't be parsed
  try {
    const date1 = toTime(a)
    const date2 = toTime(b)
    if (date1 === null || date2 === null) return 0
    const duration = date2 - date1

    // return number based on js sort function
    // > negative if a is less than b, positive if a is greater than b, and zero if they are equal.
    // [Sort Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn)
    if (duration === 0n) {
      return 0
    } else if (duration < 0n) {
      return 1
    } else {
      return -1
    }
  } catch (e) {
    return 0
  }
}
