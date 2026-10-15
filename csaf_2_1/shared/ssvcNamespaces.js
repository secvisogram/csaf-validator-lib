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
