// Uses the global `fetch` API (available in Node >= 18 and in every browser)
// instead of `undici` directly, so this module has no Node-only imports and
// doesn't crash when merely imported in a browser. Node's built-in `fetch` is
// itself implemented on top of `undici` and shares its global dispatcher, so
// existing `undici` `MockAgent`-based test mocking (see
// tests/networkMockedInformativeTests.js) still works unchanged under Node.

/**
 * @param {string} url
 * @param {() => void} onError
 */
export default async function testURL(url, onError) {
  const userAgent = await getUserAgent()
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': userAgent,
      },
    })
    if (res.status < 200 || 400 <= res.status) {
      onError()
    }
  } catch (e) {
    onError()
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
