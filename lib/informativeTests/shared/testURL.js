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
      headers: {
        'User-Agent': userAgent,
      },
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

// `node:module`'s `createRequire` is used to read package.json for a User-Agent
// header. It is dynamically imported (instead of a static top-level import) so
// this module can still be imported in a browser without crashing.
async function getUserAgent() {
  const { createRequire } = await import('node:module')
  /** @type {{ name: string; version: string }} */
  const packageInfo = createRequire(import.meta.url)('../../../package.json')
  return `${packageInfo.name.split('/').at(-1)}/${packageInfo.version}`
}
