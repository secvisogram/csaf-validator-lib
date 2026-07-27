/**
 *  https://certcc.github.io/SSVC/reference/code/namespaces/
 */

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
 * Namespace strings that must never be used at all, regardless of context (SSVC-RNS):
 * https://certcc.github.io/SSVC/reference/code/namespaces/#base-namespace
 *
 * - `invalid` / `x_invalid` — must not be used at all; always an error.
 */
export const invalidNamespace = ['invalid', 'x_invalid']

/**
 * Extracts the base namespace from a full SSVC namespace string.
 * Strips everything after the first '#' or '/'.
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
 * Returns true if `namespace` uses one of the invalid base namespace strings.
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isInvalidNamespace(namespace) {
  const preExtension = namespace.split('/')[0]
  return invalidNamespace.some(
    (invalid) =>
      preExtension === invalid ||
      preExtension.startsWith(`${invalid}.`) ||
      preExtension.startsWith(`${invalid}#`)
  )
}
