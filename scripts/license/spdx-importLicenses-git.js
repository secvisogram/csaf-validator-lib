#!/usr/bin/env node

/**
 * Script to import SPDX license list data from https://github.com/spdx/license-list-data
 * using native Node.js execFile() to execute git commands directly.
 *
 *
 * Steps:
 *   1. Clone the spdx/license-list-data repository (shallow, sparse – only json/) into a
 *      temporary directory.
 *   2. Read json/licenses.json and json/exceptions.json from the cloned repo.
 *   3. Build a version → date map from the git tags of the cloned repo.
 *   4. For each deprecated license/exception read the individual detail JSON from disk.
 *   5. Write the result to scripts/spdx_licenses.json and clean up the temp directory.
 *
 * Usage:
 *   node scripts/spdx-importLicenses-git.js
 */

import { writeFile, readFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { git } from './aboutcode-importLicenses-git.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_FILE = path.join(__dirname, 'spdx_licenses.json')

const SPDX_REPO_URL = 'https://github.com/spdx/license-list-data.git'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read and parse a JSON file from disk.
 * @param {string} filePath
 * @returns {Promise<unknown>}
 */
async function readJSON(filePath) {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

// ---------------------------------------------------------------------------
// Clone with sparse-checkout (only the json/ subtree)
// ---------------------------------------------------------------------------

/**
 * Clone the SPDX license-list-data repo into `targetDir` using a shallow,
 * sparse checkout so that only the `json/` directory is fetched.
 * @param {string} targetDir
 */
async function cloneRepo(targetDir) {
  console.log(`Cloning ${SPDX_REPO_URL} (shallow + sparse) into ${targetDir} …`)

  try {
    // 1. Create the target directory and init repo
    await mkdir(targetDir, { recursive: true })
    await git(targetDir, ['init'])

    // 2. Add remote
    await git(targetDir, ['remote', 'add', 'origin', SPDX_REPO_URL])

    // 3. Enable sparse-checkout
    await git(targetDir, ['config', 'core.sparseCheckout', 'true'])

    // Write the sparse-checkout pattern
    const sparsePath = path.join(targetDir, '.git', 'info', 'sparse-checkout')
    await mkdir(path.dirname(sparsePath), { recursive: true })
    await writeFile(sparsePath, 'json/\n', 'utf-8')

    // 4. Fetch tags + shallow main branch
    console.log('  Fetching (this may take a moment) …')
    await git(targetDir, ['fetch', '--depth=1', '--tags', 'origin', 'main'])

    // 5. Checkout
    await git(targetDir, ['checkout', 'main'])

    console.log('  Clone complete.')
  } catch (/** @type {unknown} */ error) {
    throw new Error(
      `Failed to clone repository: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

// ---------------------------------------------------------------------------
// Build version → date map from git tags
// ---------------------------------------------------------------------------

/**
 * Build a Map from SPDX list version string (e.g. "3.21") → ISO date string
 * (e.g. "2024-02-08") by reading git tags from the cloned repo.
 *
 * Tag format used by spdx/license-list-data is typically "v3.21".
 * We need to fetch all tags (they were included in the clone step via --tags).
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
      // Get the date the tag points to (for annotated tags use dereferenced object)
      try {
        const dateOutput = await git(repoDir, [
          'show',
          '-s',
          '--format=%ci',
          `${tag}^{}`,
        ])
        // %ci format: "YYYY-MM-DD HH:MM:SS +ZZZZ" – extract just the date part
        const match = dateOutput.match(/(\d{4}-\d{2}-\d{2})/)
        if (match) {
          const date = match[1]
          // Normalize: strip leading "v"
          const version = tag.replace(/^v/, '')
          map.set(version, date)
          map.set(`v${version}`, date)
        }
      } catch {
        // skip tags that cannot be resolved
      }
    }

    console.log(`  Found ${map.size / 2} tagged releases.`)
    return map
  } catch (/** @type {any} */ error) {
    throw new Error(`Failed to build version map: ${error.message}`)
  }
}

// ---------------------------------------------------------------------------
// Resolve deprecation info
// ---------------------------------------------------------------------------

/**
 * Read the deprecatedVersion for a specific license/exception from its detail JSON file.
 * @param {string} detailFilePath  Absolute path to the detail JSON on disk
 * @returns {Promise<string | null>}
 */
async function readDeprecatedVersion(detailFilePath) {
  try {
    const detail = /** @type {{deprecatedVersion?: string}} */ (
      await readJSON(detailFilePath)
    )
    return detail.deprecatedVersion ?? null
  } catch {
    return null
  }
}

/**
 * @param {string} deprecatedVersion  Raw value from the detail JSON
 * @param {Map<string, string>} versionDateMap
 * @returns {{ deprecatedSince: string, deprecatedDate: string }}
 */
function resolveDeprecation(deprecatedVersion, versionDateMap) {
  if (deprecatedVersion) {
    // Strip leading "< " (old format like "< v2.4")
    const key = deprecatedVersion.replace(/^<\s*/, '').trim()
    const deprecatedSince = `v${key.replace(/^v/, '')}`
    const deprecatedDate =
      versionDateMap.get(key) ?? versionDateMap.get(`v${key}`) ?? ''

    return { deprecatedSince, deprecatedDate }
  }

  return { deprecatedSince: '', deprecatedDate: '' }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Create a temporary directory for the clone
  const tmpDir = path.join(os.tmpdir(), `spdx-license-list-data-${Date.now()}`)

  try {
    // 1. Clone repo (shallow + sparse – only json/)
    await cloneRepo(tmpDir)

    // 2. Read license list + exception list from disk
    console.log('Reading licenses.json and exceptions.json …')

    const licensesData =
      /** @type {{licenses: Array<{licenseId: string, isDeprecatedLicenseId: boolean, detailsUrl: string}>}} */ (
        await readJSON(path.join(tmpDir, 'json', 'licenses.json'))
      )

    const exceptionsData =
      /** @type {{exceptions: Array<{licenseExceptionId: string, isDeprecatedLicenseId: boolean, detailsUrl: string}>}} */ (
        await readJSON(path.join(tmpDir, 'json', 'exceptions.json'))
      )

    // 3. Build version → date map from git tags
    const versionDateMap = await buildVersionDateMap(tmpDir)

    // 4. Process licenses
    const results = []

    console.log(`Processing ${licensesData.licenses.length} licenses …`)
    for (const license of licensesData.licenses) {
      let deprecatedSince = ''
      let deprecatedDate = ''

      if (license.isDeprecatedLicenseId) {
        // The detailsUrl looks like "https://spdx.org/licenses/GPL-2.0.json"
        // Map it to the local path:  json/details/GPL-2.0.json
        const filename = license.detailsUrl.split('/').pop() // e.g. "GPL-2.0.json"
        const detailPath = path.join(tmpDir, 'json', 'details', filename ?? '')
        const deprecatedVersion = await readDeprecatedVersion(detailPath)
        if (deprecatedVersion) {
          ;({ deprecatedSince, deprecatedDate } = resolveDeprecation(
            deprecatedVersion,
            versionDateMap
          ))
        }
      }

      results.push({
        license_key: license.licenseId,
        is_deprecated: license.isDeprecatedLicenseId,
        source: 'spdx',
        is_exception: false,
        deprecated_since: deprecatedSince,
        deprecated_date: deprecatedDate,
      })
    }

    // 5. Process exceptions
    console.log(`Processing ${exceptionsData.exceptions.length} exceptions …`)
    for (const exception of exceptionsData.exceptions) {
      let deprecatedSince = ''
      let deprecatedDate = ''

      if (exception.isDeprecatedLicenseId) {
        const filename = exception.detailsUrl.split('/').pop()
        const detailPath = path.join(tmpDir, 'json', 'details', filename ?? '')
        const deprecatedVersion = await readDeprecatedVersion(detailPath)
        if (deprecatedVersion) {
          ;({ deprecatedSince, deprecatedDate } = resolveDeprecation(
            deprecatedVersion,
            versionDateMap
          ))
        }
      }

      results.push({
        license_key: exception.licenseExceptionId,
        is_deprecated: exception.isDeprecatedLicenseId,
        source: 'spdx',
        is_exception: true,
        deprecated_since: deprecatedSince,
        deprecated_date: deprecatedDate,
      })
    }

    // 6. Sort by license_key (case-insensitive)
    results.sort((a, b) =>
      a.license_key.toLowerCase().localeCompare(b.license_key.toLowerCase())
    )

    // 7. Write output
    const output = JSON.stringify({ licenses: results }, null, 2)
    await writeFile(OUTPUT_FILE, output + '\n', 'utf-8')

    const deprecatedCount = results.filter((r) => r.is_deprecated).length
    const withDateCount = results.filter((r) => r.deprecated_date).length
    console.log(`\nDone! Written ${results.length} entries to ${OUTPUT_FILE}`)
    console.log(`  - ${deprecatedCount} deprecated entries`)
    console.log(`  - ${withDateCount} deprecated entries with a resolved date`)
  } finally {
    // 8. Clean up temp directory
    console.log(`\nCleaning up ${tmpDir} …`)
    await rm(tmpDir, { recursive: true, force: true })
    console.log('  Done.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
