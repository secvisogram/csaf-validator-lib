/**
 *  https://certcc.github.io/SSVC/reference/code/namespaces/
 */

/**
 * Registered SSVC base namespaces for production use, according to the SSVC
 * Registered Namespace specification (SSVC-RNS):
 * https://certcc.github.io/SSVC/reference/code/namespaces/#registered-namespace
 */
export const registeredSsvcNamespace = ['ssvc', 'cvss', 'cisa', 'basic', 'nist']

/**
 * All namespace strings reserved by the SSVC project (SSVC-RNS):
 * https://certcc.github.io/SSVC/reference/code/namespaces/#base-namespace
 *
 * - `example` / `x_example` — for documentation; no fixed decision-point catalogue.
 * - `test` / `x_test` — for testing; no fixed decision-point catalogue.
 * - `invalid` / `x_invalid` — must not be used at all; always an error.
 */
export const reservedNamespace = [
  'example',
  'x_example',
  'test',
  'x_test',
  'invalid',
  'x_invalid',
]

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
 * Returns true if the namespace belongs to a registered SSVC base namespace.
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isRegisteredSsvcNamespace(namespace) {
  const base = getSsvcBaseNamespace(namespace)
  if (base.startsWith('x_')) return false
  return registeredSsvcNamespace.includes(base)
}

/**
 * Returns true if `namespace` uses one of the given reserved base namespace strings.
 *
 * @param {string} namespace - full namespace string
 * @param {string[]} reservedNamespaces
 * @returns {boolean}
 */
export function usesReservedNamespace(namespace, reservedNamespaces) {
  const preExtension = namespace.split('/')[0]
  return reservedNamespaces.some(
    (reserved) =>
      preExtension === reserved ||
      preExtension.startsWith(`${reserved}.`) ||
      preExtension.startsWith(`${reserved}#`)
  )
}
