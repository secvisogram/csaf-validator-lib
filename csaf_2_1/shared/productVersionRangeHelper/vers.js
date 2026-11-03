/** @type {Promise<typeof import('@csaf-rs/vers-rs')> | undefined} */
let loading

/** @type {typeof import('@csaf-rs/vers-rs') | undefined} */
let versRs

/**
 * Loads the WebAssembly module of vers-rs. Must be awaited once before
 * `isSupportedVersScheme` is used.
 *
 * @returns {Promise<void>}
 */
export async function initVers() {
  loading ??= import('@csaf-rs/vers-rs')
  versRs = await loading
}

/**
 * Checks whether the versioning scheme of a product version range in the
 * VERS syntax is supported by vers-rs. Syntax errors in the constraints do not
 * make the scheme unsupported.
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isSupportedVersScheme(range) {
  try {
    versRs?.parse(range.trim())
    return true
  } catch (e) {
    return !String(e).includes('Unsupported versioning scheme')
  }
}
