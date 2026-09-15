#!/usr/bin/env node

/**
 * Script to import AboutCode / ScanCode license list data from
 * https://scancode-licensedb.aboutcode.org/index.json
 * using native Node.js execFile() to execute git commands directly.
 * You need git locally installed and available in your PATH for this script to work.
 *
 * Steps:
 *   1. Fetch the license index from
 *      https://scancode-licensedb.aboutcode.org/index.json.
 *   2. Clone the aboutcode-org/scancode-toolkit repository using a blobless
 *      partial clone (--filter=blob:none) with sparse-checkout restricted to
 *      src/licensedcode/data/licenses/.
 *   3. Build a version → date map from the git tags of the cloned repo.
 *   4. For each deprecated license use `git log -S 'is_deprecated: yes'` on
 *      its .LICENSE file to find the oldest commit that introduced the
 *      deprecation flag.
 *   5. Write the result to scripts/aboutcode_licenses.json and clean up.
 *
 * Usage:
 *   node scripts/aboutcode-importLicenses-git.js
 */

import { writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = path.join(__dirname, 'aboutcode_licenses.json')

const SCANCODE_REPO_URL =
  'https://github.com/aboutcode-org/scancode-toolkit.git'

/** Sparse-checkout path inside the repo */
const SPARSE_PATH = 'src/licensedcode/data/licenses/'

/** Public JSON index of all ScanCode licenses */
const INDEX_URL = 'https://scancode-licensedb.aboutcode.org/index.json'

// ---------------------------------------------------------------------------
// Helper: Execute git commands
// ---------------------------------------------------------------------------

/**
 * Execute a git command in the specified directory.
 *
 * @param {string} cwd - Working directory for the git command
 * @param {string[]} args - Arguments to pass to git
 * @returns {Promise<string>} - stdout output
 */
export async function git(cwd, args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd })
    return stdout.trim()
  } catch (/** @type {any} */ error) {
    throw new Error(
      `Git command failed: git ${args.join(' ')}\n${error.message}`
    )
  }
}

// ---------------------------------------------------------------------------
// Clone with blobless partial clone + sparse-checkout
// ---------------------------------------------------------------------------

/**
 * Clone the scancode-toolkit repo into `targetDir` using a blobless partial
 * clone so that full commit history is available without fetching every blob.
 * Only the `src/licensedcode/data/licenses/` subtree is checked out.
 *
 * @param {string} targetDir
 */
async function cloneRepo(targetDir) {
  console.log(
    `Cloning ${SCANCODE_REPO_URL} (blobless + sparse) into ${targetDir} …`
  )
  await mkdir(targetDir, { recursive: true })
  try {
    await execFileAsync('git', [
      'clone',
      '--filter=blob:none',
      '--sparse',
      '--single-branch',
      '--branch',
      'develop',
      SCANCODE_REPO_URL,
      targetDir,
    ])

    // Configure sparse-checkout to only the licenses directory
    await git(targetDir, ['sparse-checkout', 'set', SPARSE_PATH])

    console.log('  Clone complete.')
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to clone repository: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// Build version → date map from git tags
// ---------------------------------------------------------------------------

/**
 * Build a Map from ScanCode version string → ISO date string by reading git
 * tags from the cloned repo.
 *
 * @param {string} repoDir
 * @returns {Promise<Map<string, string>>}
 */
async function buildVersionDateMap(repoDir) {
  console.log('Building version → date map from git tags …')

  try {
    const tagOutput = await git(repoDir, ['tag', '-l'])
    const tags = tagOutput.split('\n').filter(Boolean)

    /** @type {Map<string, string>} */
    const map = new Map()

    for (const tag of tags) {
      try {
        const dateOutput = await git(repoDir, [
          'show',
          '-s',
          '--format=%ci',
          `${tag}^{}`,
        ])
        const match = dateOutput.match(/(\d{4}-\d{2}-\d{2})/)
        if (match) {
          const date = match[1]
          const version = tag.replace(/^v/, '')
          map.set(version, date)
          map.set(`v${version}`, date)
        }
      } catch {
        // Ignore tags that don't have the expected format
      }
    }

    console.log(`  Found ${map.size / 2} tagged releases.`)
    return map
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to build version map: ${error.message}`)
  }
}

/**
 * Given a deprecation commit date, find the earliest release tag whose date
 * is >= that date (i.e. the first release that shipped with the license
 * already deprecated).
 *
 * @param {string} deprecatedDate  ISO date string (YYYY-MM-DD)
 * @param {Map<string, string>} versionDateMap  version → date
 * @returns {string}  version string like "v32.0", or "" if not found
 */
function findDeprecatedSince(deprecatedDate, versionDateMap) {
  if (deprecatedDate) {
    // Collect unique entries (only "vX.Y" keys to avoid duplicates)
    const entries = []
    const seenVersions = new Set()
    for (const [key, date] of versionDateMap) {
      if (key.startsWith('v') && !seenVersions.has(key)) {
        entries.push({ version: key, date })
        seenVersions.add(key)
      }
    }

    // Sort by date ascending
    entries.sort((a, b) => a.date.localeCompare(b.date))

    // Find the first release on or after the deprecation commit date
    const found = entries.find((e) => e.date >= deprecatedDate)
    return found ? found.version : ''
  } else {
    return ''
  }
}

// ---------------------------------------------------------------------------
// Determine deprecation date from git history
// ---------------------------------------------------------------------------

/**
 * Find the date when `is_deprecated: yes` was first added to a .LICENSE file
 * by scanning the git log for commits that introduced that string.
 *
 * @param {string} repoDir
 * @param {string} licenseKey
 * @returns {Promise<string>}  ISO date string (YYYY-MM-DD) or empty string
 */
async function findDeprecationCommitDate(repoDir, licenseKey) {
  const filePath = `${SPARSE_PATH}${licenseKey}.LICENSE`

  try {
    const output = await git(repoDir, [
      'log',
      '--format=%ci',
      '-S',
      'is_deprecated: yes',
      '--',
      filePath,
    ])

    const lines = output
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length > 0) {
      // The oldest commit is the last line
      const oldest = lines[lines.length - 1]
      const match = oldest.match(/^(\d{4}-\d{2}-\d{2})/)
      return match ? match[1] : ''
    } else {
      return ''
    }
  } catch {
    return ''
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 1. Fetch the license index
  console.log(`Fetching license index from ${INDEX_URL} …`)
  const response = await fetch(INDEX_URL)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${INDEX_URL}: ${response.status} ${response.statusText}`
    )
  }

  /**
   * @type {Array<{
   *   license_key: string,
   *   is_deprecated: boolean,
   *   is_exception: boolean,
   *   [key: string]: unknown
   * }>}
   */
  const indexEntries = await response.json()
  console.log(`  Found ${indexEntries.length} entries in the index.`)

  const deprecatedEntries = indexEntries.filter((e) => e.is_deprecated)
  console.log(`  ${deprecatedEntries.length} are deprecated.`)

  // Create a temporary directory for the clone
  const tmpDir = path.join(
    os.tmpdir(),
    `scancode-toolkit-licenses-${Date.now()}`
  )

  try {
    // 2. Clone repo (blobless + sparse)
    await cloneRepo(tmpDir)

    // 3. Build version → date map from git tags
    const versionDateMap = await buildVersionDateMap(tmpDir)

    // 4. Process each entry from the index
    console.log(`\nProcessing ${indexEntries.length} licenses …`)

    /**
     * @type {Array<{
     *   license_key: string,
     *   is_deprecated: boolean,
     *   is_exception: boolean,
     *   source: 'aboutCode',
     *   deprecated_since: string,
     *   deprecated_date: string
     * }>}
     */
    const results = []

    for (const entry of indexEntries) {
      let deprecatedDate = ''
      let deprecatedSince = ''
      console.log(`\nProcess ${entry.license_key} `)
      if (entry.is_deprecated) {
        console.log(`\ndeprecated `)
        deprecatedDate = await findDeprecationCommitDate(
          tmpDir,
          entry.license_key
        )
        deprecatedSince = findDeprecatedSince(deprecatedDate, versionDateMap)
      }

      results.push({
        license_key: entry.license_key,
        is_deprecated: Boolean(entry.is_deprecated),
        is_exception: Boolean(entry.is_exception),
        source: 'aboutCode',
        deprecated_since: deprecatedSince,
        deprecated_date: deprecatedDate,
      })
    }

    // 5. Sort by license_key (case-insensitive)
    results.sort((a, b) =>
      a.license_key.toLowerCase().localeCompare(b.license_key.toLowerCase())
    )

    // 6. Write output
    const output = JSON.stringify({ licenses: results }, null, 2)
    await writeFile(OUTPUT_FILE, output + '\n', 'utf-8')

    const deprecatedCount = results.filter((r) => r.is_deprecated).length
    const withDateCount = results.filter((r) => r.deprecated_date).length
    const withVersionCount = results.filter((r) => r.deprecated_since).length
    console.log(`\nDone! Written ${results.length} entries to ${OUTPUT_FILE}`)
    console.log(`  - ${deprecatedCount} deprecated entries`)
    console.log(`  - ${withDateCount} deprecated entries with a resolved date`)
    console.log(
      `  - ${withVersionCount} deprecated entries with a resolved version`
    )
  } finally {
    // 7. Clean up temp directory
    console.log(`\nCleaning up ${tmpDir} …`)
    await rm(tmpDir, { recursive: true, force: true })
    console.log('  Done.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
