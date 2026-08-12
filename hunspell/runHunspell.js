/**
 * Spell-check a string using hunspell and return the raw output.
 * @param {object} params
 * @param {string} params.dictionary
 * @param {string} params.input
 * @returns {Promise<string>}
 */
export default async function runHunspell({ dictionary, input }) {
  // Dynamic import: keeps this module importable outside Node.
  const { execFile } = await import('node:child_process')
  return await new Promise((resolve, reject) => {
    const child = execFile('hunspell', ['-d', dictionary], (err, stdout) => {
      if (err) return reject(err)
      resolve(stdout)
    })
    child.stdin?.end(input)
  })
}
