// Uses the global `fetch` API (available in Node >= 18 and in every browser)
// instead of `undici` directly, so this module has no Node-only imports and
// doesn't crash when merely imported in a browser. Node's built-in `fetch` is
// itself implemented on top of `undici` and shares its global dispatcher, so
// existing `undici` `MockAgent`-based test mocking (see
// tests/networkMockedInformativeTests.js) still works unchanged under Node.

/**
 * Checks whether `url` can be reached, using a `HEAD` request by default.
 * Pass `{ method: 'GET' }` to get back the response itself, e.g. to read
 * its body or headers, instead of just a success/failure signal.
 *
 * On a network error or an error status (< 200 or >= 400), `onError` is
 * called and `undefined` is returned.
 *
 * @param {string} url
 * @param {() => void} onError
 * @param {{ method: 'GET' }} [options]
 * @returns {Promise<Response | undefined>}
 */
export default async function testURL(url, onError, options) {
  const userAgent = await getUserAgent()
  try {
    const res = await fetch(url, {
      method: options?.method ?? 'HEAD',
      headers: userAgent ? { 'User-Agent': userAgent } : {},
    })
    if (res.status < 200 || 400 <= res.status) {
      onError()
      return undefined
    }
    return options ? res : undefined
  } catch (e) {
    onError()
    return undefined
  }
}

/**
 * Reads package.json via `node:module`'s `createRequire` for a User-Agent
 * header. Node-only, so this is skipped in a browser runtime: the
 * `webpackIgnore` comment stops bundlers from resolving `node:` at build
 * time, and browsers forbid setting `User-Agent` on `fetch` anyway, so
 * skipping it there is a no-op.
 *
 * @returns {Promise<string | undefined>}
 */
async function getUserAgent() {
  const isBrowserRuntime =
    typeof process === 'undefined' || !process.versions?.node
  if (isBrowserRuntime) {
    return undefined
  }
  const { createRequire } = await import(
    /* webpackIgnore: true */ 'node:module'
  )
  /** @type {{ name: string; version: string }} */
  const packageInfo = createRequire(import.meta.url)('../../../package.json')
  return `${packageInfo.name.split('/').at(-1)}/${packageInfo.version}`
}
