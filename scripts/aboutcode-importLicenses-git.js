#!/usr/bin/env node

/**
 * Script to import AboutCode / ScanCode license list data from
 * https://scancode-licensedb.aboutcode.org/index.json
 * using simple-git to determine the deprecation date from the git history.
 *
 * Steps:
 *   1. Fetch the license index from
 *      https://scancode-licensedb.aboutcode.org/index.json.
 *   2. Clone the aboutcode-org/scancode-toolkit repository using a blobless
 *      partial clone (--filter=blob:none) with sparse-checkout restricted to
 *      src/licensedcode/data/licenses/.  This gives us full commit history
 *      without downloading every file blob upfront.
 *   3. Build a version → date map from the git tags of the cloned repo.
 *   4. For each deprecated license use `git log -S 'is_deprecated: yes'` on
 *      its .LICENSE file to find the oldest commit that introduced the
 *      deprecation flag.  That commit's date becomes `deprecated_date`.
 *      The earliest release tag whose date is >= that commit date becomes
 *      `deprecated_since`.
 *   5. Write the result to scripts/aboutcode_licenses.json and clean up.
 *
 * Usage:
 *   node scripts/aboutcode-importLicenses-git.js
 */

import { writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import simpleGit from 'simple-git'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = path.join(__dirname, 'aboutcode_licenses.json')

const SCANCODE_REPO_URL =
  'https://github.com/aboutcode-org/scancode-toolkit.git'

/** Sparse-checkout path inside the repo */
const SPARSE_PATH = 'src/licensedcode/data/licenses/'

/** Public JSON index of all ScanCode licenses */
const INDEX_URL = 'https://scancode-licensedb.aboutcode.org/index.json'

// ---------------------------------------------------------------------------
// Clone with blobless partial clone + sparse-checkout
// ---------------------------------------------------------------------------

/**
 * Clone the scancode-toolkit repo into `targetDir` using a blobless partial
 * clone so that full commit history is available without fetching every blob.
 * Only the `src/licensedcode/data/licenses/` subtree is checked out.
 * Tags are fetched so we can map versions to dates.
 *
 * @param {string} targetDir
 */
async function cloneRepo(targetDir) {
  console.log(
    `Cloning ${SCANCODE_REPO_URL} (blobless + sparse) into ${targetDir} …`
  )

  // Use git directly via simpleGit's raw interface so we can pass
  // --filter=blob:none and --sparse in a single clone command.
  const git = simpleGit()
  await git.clone(SCANCODE_REPO_URL, targetDir, [
    '--filter=blob:none',
    '--sparse',
    '--single-branch',
    '--branch',
    'develop',
  ])

  // Configure sparse-checkout to only the licenses directory
  const repoGit = simpleGit(targetDir)
  await repoGit.raw(['sparse-checkout', 'set', SPARSE_PATH])

  console.log('  Clone complete.')
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

  const repoGit = simpleGit(repoDir)

  // List all tags
  const tagResult = await repoGit.tags()
  const tags = tagResult.all

  /** @type {Map<string, string>} */
  const map = new Map()

  for (const tag of tags) {
    let date = ''
    try {
      const output = await repoGit.raw([
        'show',
        '-s',
        '--format=%ci',
        `${tag}^{}`,
      ])
      const match = output.match(/(\d{4}-\d{2}-\d{2})/)
      date = match ? match[1] : ''
    } catch {
      continue
    }

    if (date) {
      const version = tag.replace(/^v/, '')
      map.set(version, date)
      map.set(`v${version}`, date)
    }
  }

  console.log(`  Found ${map.size / 2} tagged releases.`)
  return map
}

/**
 * Given a deprecation commit date, find the earliest release tag whose date
 * is >= that date (i.e. the first release that shipped with the license
 * already deprecated).
 *
 * @param {string} deprecatedDate  ISO date string (YYYY-MM-DD)
 * @param {Map<string, string>} versionDateMap  version → date (both "x.y" and "vx.y" keys)
 * @returns {string}  version string like "v32.0", or "" if not found
 */
function findDeprecatedSince(deprecatedDate, versionDateMap) {
  if (deprecatedDate) {
    // Collect unique entries (only "vX.Y" keys to avoid duplicates)
    const entries = []
    for (const [key, date] of versionDateMap) {
      entries.push({ version: key, date })
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
 * `git log --format=%ci -S 'is_deprecated: yes' -- <file>` returns, newest
 * first, all commits where the count of `is_deprecated: yes` changed.  The
 * *last* line of the output is the earliest such commit (= when deprecation
 * was first set).
 *
 * @param {string} repoDir
 * @param {string} licenseKey
 * @returns {Promise<string>}  ISO date string (YYYY-MM-DD) or empty string
 */
async function findDeprecationCommitDate(repoDir, licenseKey) {
  const filePath = `${SPARSE_PATH}${licenseKey}.LICENSE`
  const repoGit = simpleGit(repoDir)

  try {
    const output = await repoGit.raw([
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
    await mkdir(tmpDir, { recursive: true })
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
