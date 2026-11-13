/**
 * SSVC Namespace Specification: https://certcc.github.io/SSVC/reference/code/namespaces/
 *
 * Namespaces reserved for special purpose and MUST be treated as per their
 * definition (spec section "Reserved Namespace Strings").
 *
 * @type {string[]}
 */
export const specialPurposeSsvcNamespaces = ['x_example', 'x_test']

/**
 * Extracts the base namespace from a full SSVC namespace string.
 * Strips everything after the first '#' or '/'.
 *
 * @param {string} namespace
 * @returns {string}
 */
export function getSsvcBaseNamespace(namespace) {
  const hashIdx = namespace.indexOf('#')
  const slashIdx = namespace.indexOf('/')

  let endIdx = namespace.length
  if (hashIdx !== -1) endIdx = Math.min(endIdx, hashIdx)
  if (slashIdx !== -1) endIdx = Math.min(endIdx, slashIdx)

  return namespace.substring(0, endIdx)
}

/**
 * Returns true if the namespace is a valid unregistered SSVC namespace.
 *
 * Unregistered namespaces must:
 * - start with the `x_` prefix
 * - followed by a reverse domain name (alphanumeric, dots, dashes)
 * - followed by `#` and a non-empty fragment
 * - contain only alphanumeric characters, dots (.), and dashes (-) besides `x_` and `#`
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isUnregisteredNamespace(namespace) {
  // x_ + one or more labels (dot-separated) + optional #fragment
  return /^x_[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(#[a-zA-Z0-9.\-]+)?$/.test(
    namespace
  )
}

/**
 * Returns true if the namespace uses a reserved special-purpose prefix
 * (x_example or x_test). These namespaces are valid structurally but must
 * not be used in production.
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isSpecialPurposeSsvcNamespace(namespace) {
  const base = getSsvcBaseNamespace(namespace)
  return specialPurposeSsvcNamespaces.some((prefix) => base === prefix)
}

/**
 * Registered SSVC base namespaces for production use, according to the SSVC
 * Registered Namespace specification (SSVC-RNS):
 * https://certcc.github.io/SSVC/reference/code/namespaces/#registered-namespace
 */
export const registeredSsvcNamespaces = [
  'ssvc',
  'cvss',
  'cisa',
  'basic',
  'example',
  'test',
  'nist',
]

/**
 * Returns true if the namespace belongs to a registered SSVC base namespace.
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isRegisteredSsvcNamespace(namespace) {
  const base = getSsvcBaseNamespace(namespace)
  if (base.startsWith('x_')) return false
  return registeredSsvcNamespaces.includes(base)
}

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
