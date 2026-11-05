import init, { initSync, Vls } from '@csaf-rs/vers-like-specifier'

/** @type {Promise<unknown> | undefined} */
let initialized

/**
 * Loads the WebAssembly module of vers-like-specifier. Must be awaited once
 * before `isValidVls` is used.
 *
 * @returns {Promise<void>}
 */
export async function initVls() {
  initialized ??= loadWasm()
  await initialized
}

async function loadWasm() {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const [{ readFile }, { fileURLToPath }] = await Promise.all([
      import(/* webpackIgnore: true */ 'node:fs/promises'),
      import(/* webpackIgnore: true */ 'node:url'),
    ])
    const wasmUrl = import.meta.resolve(
      '@csaf-rs/vers-like-specifier/vers_like_specifier_bg.wasm'
    )
    initSync({ module: await readFile(fileURLToPath(wasmUrl)) })
  } else {
    await init()
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
  try {
    Vls.parse(range).free()
    return true
  } catch {
    return false
  }
}
