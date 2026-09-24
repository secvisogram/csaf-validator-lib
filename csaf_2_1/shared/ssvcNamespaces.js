/**
 * SSVC Namespace Specification: https://certcc.github.io/SSVC/reference/code/namespaces/
 */

/**
 * Returns true if the given full SSVC namespace string uses an extension.
 *
 * Extensions are always separated from the base namespace (which may itself
 * have an optional `#`-fragment) by a `/` character. Neither the base
 * namespace nor its fragment may contain a `/`, so the presence of a `/`
 * unambiguously indicates that an extension segment follows.
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function hasSsvcNamespaceExtension(namespace) {
  return namespace.includes('/')
}

/**
 * Extracts all BCP-47 language tag candidates that are embedded within the
 * extension segments of a given full SSVC namespace string.
 *
 * Per the SSVC namespace extension structure:
 * - The first extension segment (directly following the base namespace) is
 *   either empty (implying the default language) or a BCP-47 language tag.
 * - Every subsequent extension segment is either:
 *   - a "language only" segment consisting solely of a non-empty BCP-47
 *     language tag (it does not start with a `.`), or
 *   - an extension/translation segment that starts with a `.` (reverse
 *     domain name notation, with an optional `#`-fragment). If such a
 *     segment additionally contains a `$`, the part following the `$` is a
 *     BCP-47 language tag denoting a translation of that extension.
 *
 * @param {string} namespace - full namespace string
 * @returns {string[]} the language tag candidates found in `namespace`
 */
export function getSsvcNamespaceLanguageTags(namespace) {
  const segments = namespace.split('/')
  // segments[0] is the base namespace (with an optional fragment) - it is
  // never a language tag by itself.
  const extensionSegments = segments.slice(1)

  /** @type {string[]} */
  const languageTags = []

  extensionSegments.forEach((segment, index) => {
    if (index === 0) {
      // The first extension segment may be empty (default language implied)
      // or a language tag.
      if (segment !== '') {
        languageTags.push(segment)
      }
      return
    }

    if (segment.startsWith('.')) {
      // Extension segment, optionally a translation segment ending in
      // `$<language-tag>`.
      const dollarIndex = segment.indexOf('$')
      if (dollarIndex !== -1) {
        languageTags.push(segment.slice(dollarIndex + 1))
      }
    } else {
      // Language-only segment.
      if (segment !== '') {
        languageTags.push(segment)
      }
    }
  })

  return languageTags
}
