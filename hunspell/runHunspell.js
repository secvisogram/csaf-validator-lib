/**
 * Spell-check a string using hunspell and return the raw output.
 * @param {object} params
 * @param {string} params.dictionary
 * @param {string} params.input
 * @returns {Promise<string>}
 */
export default async function runHunspell({ dictionary, input }) {
  // Imported dynamically (instead of a top-level static import) so this module
  // - part of the informativeTests barrel export - can be imported in a browser
  // without crashing. `node:child_process` has no browser equivalent, so this
  // function still can't actually run there; callers are expected to skip
  // invoking it outside Node (see tests/shared/isBrowserRuntime.js).
  const { execFile } = await import('node:child_process')
  return await new Promise((resolve, reject) => {
    const child = execFile('hunspell', ['-d', dictionary], (err, stdout) => {
      if (err) return reject(err)
      resolve(stdout)
    })
    child.stdin?.end(input)
  })
}
