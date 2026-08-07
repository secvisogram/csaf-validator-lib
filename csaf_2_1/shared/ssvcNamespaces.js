/**
 * Registered SSVC base namespaces according to the SSVC Registered Namespace
 * specification (SSVC-RNS):
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
 * Returns true if the namespace belongs to a registered SSVC base namespace.
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isRegisteredSsvcNamespace(namespace) {
  const base = getSsvcBaseNamespace(namespace)
  if (base.startsWith('x_')) return false
  return registeredSsvcNamespaces.includes(base)
}
