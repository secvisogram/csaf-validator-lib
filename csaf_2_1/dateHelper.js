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

/**
 * This regex validates a date against RFC 3339 section 5.6.
 * See: https://datatracker.ietf.org/doc/html/rfc3339#section-5.6
 */
export const timestampRegex =
  /^(?<date>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?<fraction>\.\d+)?(?<timezone>Z|[+-]\d{2}:\d{2})$/

/**
 * Result type if a validation was successful.
 *
 * @typedef {object} IsValidResult
 * @property {true} isValid
 */

/**
 * Result type if a validation errored.
 *
 * @typedef {object} ErrorResult
 * @property {false} isValid
 * @property {'INVALID_FORMAT' | 'INVALID_DATE'} error Error reason
 */

/** @typedef {IsValidResult | ErrorResult} ValidateTimestampResult */

/**
 * Checks if the given string is a semantically correct timestamp (RFC 3339). With one
 * exception: It does not allow leap seconds.
 *
 * @param {string} date
 * @returns {ValidateTimestampResult}
 */
export const validateTimestamp = (date) => {
  const match = timestampRegex.exec(date)

  // Here we first match against the date regex to catch format errors.
  if (!match) {
    return { isValid: false, error: 'INVALID_FORMAT' }
  }

  // Reassemble the date string from the named capture groups. The fractional
  // seconds component is truncated to at most 9 digits (`.` + 9 digits = 10
  // characters) because the (polyfilled) Temporal.Instant object only supports
  // up to nanosecond precision and rejects strings with more fractional digits.
  const trimmedDate = `${match.groups?.date ?? ''}${
    match.groups?.fraction?.slice(0, 10) ?? ''
  }${match.groups?.timezone ?? ''}`

  try {
    // Temporal.Instant.from() throws an error if the date is invalid. But they
    // normalize the date if e.g. there are 60 seconds (leap second) ...
    Temporal.Instant.from(trimmedDate)

    // ... To handle that case we additionally use the date constructor which
    // does not allow more than 59 seconds at all.
    if (Number.isNaN(new Date(trimmedDate).getTime())) {
      return { isValid: false, error: 'INVALID_DATE' }
    }
    return { isValid: true }
  } catch (e) {
    return { isValid: false, error: 'INVALID_DATE' }
  }
}
