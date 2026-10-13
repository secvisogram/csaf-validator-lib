/**
 * SSVC Namespace Specification: https://certcc.github.io/SSVC/reference/code/namespaces/
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
