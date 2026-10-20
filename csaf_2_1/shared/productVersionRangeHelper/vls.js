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
  vlsLib = await loading
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
  const constraints = range.trim().replace(/^vers:[^/]*\//i, '')
  try {
    return vlsLib?.Vls.parse(constraints).isSingleVersion() ?? false
  } catch {
    return false
  }
}
