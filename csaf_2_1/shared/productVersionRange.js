// regex to match the prefix of a product version range that uses the `vers` comparator
export const VERS_PREFIX = /^vers:[a-z\.\-\+][a-z0-9\.\-\+]*\//

/**
 * Checks whether a `product_version_range` branch `name` uses the `vers`
 * syntax (see section 3.1.3.3.2 of the CSAF 2.1 standard), i.e. it forms a
 * "product version range sibling set - vers" (`PVRSS-vers`) element.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isVersFormat(name) {
  return VERS_PREFIX.test(name.trim())
}

/**
 * Checks whether a `product_version_range` branch `name` uses the legacy
 * "vls" syntax, i.e. a product version range that does not use the `vers`
 * comparator (see section 3.1.3.3.2 of the CSAF 2.1 standard). It forms a
 * "product version range sibling set - vls" (`PVRSS-vls`) element.
 *
 * NOTE: This only checks the absence of the `vers:` prefix. It does NOT
 * validate that `name` actually is well-formed "vls" syntax - use
 * `isValidVls` from `vlsRangesOverlap.js` for that.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isVlsFormat(name) {
  return !isVersFormat(name)
}
