// Eagerly loaded so this module works the same under Node and in the browser (no
// `node:fs` access there). Scoped to `tests/**` (this file's parent directory) which
// only contains the small per-test `failing`/`valid` example fixture sets (~60 files
// total) - safe to bundle eagerly, unlike the much larger OASIS fixture corpora under
// the `csaf/` git submodule (see tests/oasis.js / tests/csaf_2_1/oasis.js instead).
const exampleModules = import.meta.glob('../**/*.json', {
  eager: true,
  import: 'default',
})

// Deliberately avoids Node's `path`/`url` builtins (e.g. `dirname`/`basename`/
// `fileURLToPath`) - unlike `path`, the global `URL` class is available in both Node and
// the browser, so string-splitting its `.href` keeps this module import-safe everywhere.

/**
 * @param {URL} url
 * @returns {Promise<[string, unknown][]>}
 */
export default async function readExampleFiles(url) {
  const examplesDir = url.href.replace(/\/$/, '')

  const examples = Object.entries(exampleModules)
    .filter(([key]) => {
      const resolvedHref = new URL(key, import.meta.url).href
      const lastSlashIndex = resolvedHref.lastIndexOf('/')
      return resolvedHref.slice(0, lastSlashIndex) === examplesDir
    })
    .map(([key, data]) => {
      const resolvedHref = new URL(key, import.meta.url).href
      const name = resolvedHref.slice(resolvedHref.lastIndexOf('/') + 1)
      return /** @type {[string, unknown]} */ ([name, data])
    })

  return examples
}
