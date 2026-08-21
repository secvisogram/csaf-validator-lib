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
