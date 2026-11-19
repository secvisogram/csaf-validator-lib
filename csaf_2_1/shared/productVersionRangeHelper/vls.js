/** @type {Promise<typeof import('@csaf-rs/vers-like-specifier')> | undefined} */
let loading

/** @type {typeof import('@csaf-rs/vers-like-specifier') | undefined} */
let vlsLib

/**
 * Loads the WebAssembly module of vers-like-specifier. Must be awaited once
 * before `isSingleVersionRange` is used.
 *
 * @returns {Promise<void>}
 */
export async function initVls() {
  loading ??= load()
  try {
    vlsLib = await loading
  } catch (error) {
    // do not cache a failed load so that a later call can retry
    loading = undefined
    throw error
  }
}

/**
 * Checks whether a product version range is well-formed "vls". Requires that
 * `initVls` has been awaited before.
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isValidVls(range) {
  if (!vlsLib) throw new Error('initVls() must be awaited first')
  try {
    vlsLib.Vls.parse(range).free()
    return true
  } catch {
    return false
  }
}

/**
 * @returns {Promise<typeof import('@csaf-rs/vers-like-specifier')>}
 */
async function load() {
  const lib = await import('@csaf-rs/vers-like-specifier')
  if (typeof process !== 'undefined' && process.versions?.node) {
    // fetch() cannot load file URLs in Node.js
    const { readFile } = await import(
      /* webpackIgnore: true */ 'node:fs/promises'
    )
    const wasmUrl = new URL(
      'vers_like_specifier_bg.wasm',
      import.meta.resolve('@csaf-rs/vers-like-specifier')
    )
    await lib.default({ module_or_path: await readFile(wasmUrl) })
  } else {
    await lib.default()
  }
  return lib
}

/**
 * Checks whether a product version range (`vers:<scheme>/<constraints>`)
 * identifies only a single version. Values that are not parsable are not
 * reported as single version.
 *
 * @param {string} range
 * @returns {boolean}
 */
export function isSingleVersionRange(range) {
  let constraints = range.trim()
  if (/^vers:/i.test(constraints)) {
    // malformed vers: values (empty scheme, missing slash) are reported by 6.1.50
    const match = /^vers:[^/]+\/(.*)$/i.exec(constraints)
    if (!match) return false
    constraints = match[1]
  }
  if (!vlsLib) throw new Error('initVls() must be awaited first')
  try {
    vlsLib.Vls.parse(constraints).free()
    return false
  } catch (error) {
    // the library only exposes the message of its "SingleVersionNotAllowed" error
    return error instanceof Error && /single version/i.test(error.message)
  }
}
