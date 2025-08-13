import { Temporal } from 'temporal-polyfill'

/**
 * compare iso timestamps
 * returns a negative number if a is less than b, positive if a is greater than b, and zero if they are equal.
 * This function also returns 0 if one of the given values could not be parsed.
 *
 * @param {string} a
 * @param {string} b
 */
export const compareZonedDateTimes = (a, b) => {
  try {
    const duration = Temporal.Instant.from(b).until(Temporal.Instant.from(a))
    return duration.sign
  } catch (e) {
    return 0
  }
}
