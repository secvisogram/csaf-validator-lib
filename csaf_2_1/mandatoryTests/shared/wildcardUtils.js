/**
 * Checks if the `stringToCheck` includes more than one unescaped `*` character. A `*` character
 * can be escaped by prefixing it with a backslash (`\`).
 *
 * @param {string} stringToCheck
 * @return {boolean}
 */
export function containsMultipleUnescapedStars(stringToCheck) {
  const regex = /\*/g
  return (
    (stringToCheck
      .replace(/\\\*/g, '') // remove escaped '*'
      .match(regex)?.length ?? 0) > 1 // check if there is more than 1 unescaped '*'
  )
}
