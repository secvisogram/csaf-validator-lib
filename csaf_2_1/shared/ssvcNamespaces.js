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
  return /^x_[a-zA-Z0-9.\-]+(#[a-zA-Z0-9.\-]+)$/.test(namespace)
}
