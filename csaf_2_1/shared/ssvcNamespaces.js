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
