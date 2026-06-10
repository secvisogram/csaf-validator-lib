/**
 * Registered SSVC base namespaces according to:
 * https://github.com/CERTCC/SSVC/blob/main/src/ssvc/namespaces.py
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
 * Algorithm (mirrors SSVC namespaces.py):
 * 1. Take the part before the first '/' (strips extension)
 * 2. Take the part before the first '#' (strips fragment)
 *
 * @param {string} namespace
 * @returns {string}
 */
export function getSsvcBaseNamespace(namespace) {
  const beforeSlash = namespace.split('/')[0]
  return beforeSlash.split('#')[0]
}

/**
 * Returns true if the base namespace is a known registered namespace.
 *
 * @param {string} namespace - full namespace string
 * @returns {boolean}
 */
export function isRegisteredSsvcNamespace(namespace) {
  return registeredSsvcNamespaces.includes(getSsvcBaseNamespace(namespace))
}

