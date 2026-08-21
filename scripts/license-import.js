#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import prettier from 'prettier'

/**
 * Regenerates the SPDX/ScanCode license and exception id lists (`lib/spdx`)
 * from the `license-list-data` and `scancode-licensedb` git submodules.
 *
 * Run again after the submodules were updated:
 *
 *   git submodule update --remote license-list-data scancode-licensedb
 *   node scripts/licenseExpressions-import.js
 */

/**
 * @typedef {{ id: string; deprecated: boolean }} LicenseId
 */

/**
 * @param {string} outputFile
 * @param {LicenseId[]} ids
 */
async function writeIds(outputFile, ids) {
  const sorted = [...ids].sort((a, b) => a.id.localeCompare(b.id))
  await writeFile(
    outputFile,
    prettier.format(
      `export default /** @type {const} */ (${JSON.stringify(sorted)})`,
      {
        ...(await prettier.resolveConfig(outputFile)),
        filepath: outputFile,
      }
    )
  )
}

// @ts-ignore: The submodule is excluded from tsconfig but is used here for type
//   inference
/** @type {typeof import('../license-list-data/json/licenses.json')} */
const spdxLicensesJson = JSON.parse(
  await readFile(
    resolve(import.meta.dirname, '..', 'license-list-data/json/licenses.json'),
    'utf-8'
  )
)
await writeIds(
  resolve(import.meta.dirname, '..', 'lib/spdx/licenses-spdx.js'),
  spdxLicensesJson.licenses.map(
    (
      /** @type {{ licenseId: string; isDeprecatedLicenseId: boolean }} */ l
    ) => ({
      id: l.licenseId,
      deprecated: l.isDeprecatedLicenseId,
    })
  )
)

// @ts-ignore: The submodule is excluded from tsconfig but is used here for type
//   inference
/** @type {typeof import('../license-list-data/json/exceptions.json')} */
const spdxExceptionsJson = JSON.parse(
  await readFile(
    resolve(
      import.meta.dirname,
      '..',
      'license-list-data/json/exceptions.json'
    ),
    'utf-8'
  )
)
await writeIds(
  resolve(import.meta.dirname, '..', 'lib/spdx/exceptions-spdx.js'),
  spdxExceptionsJson.exceptions.map(
    (
      /** @type {{ licenseExceptionId: string; isDeprecatedLicenseId: boolean }} */ e
    ) => ({
      id: e.licenseExceptionId,
      deprecated: e.isDeprecatedLicenseId,
    })
  )
)

// @ts-ignore: The submodule is excluded from tsconfig but is used here for type
//   inference
/** @type {typeof import('../scancode-licensedb/docs/index.json')} */
const scancodeIndex = JSON.parse(
  await readFile(
    resolve(import.meta.dirname, '..', 'scancode-licensedb/docs/index.json'),
    'utf-8'
  )
)
await writeIds(
  resolve(import.meta.dirname, '..', 'lib/spdx/licenses-scancode.js'),
  scancodeIndex.flatMap((entry) =>
    entry.is_exception
      ? []
      : {
          id: entry.license_key,
          deprecated: entry.is_deprecated,
        }
  )
)
await writeIds(
  resolve(import.meta.dirname, '..', 'lib/spdx/exceptions-scancode.js'),
  scancodeIndex.flatMap((entry) =>
    entry.is_exception
      ? {
          id: entry.license_key,
          is_exception: entry.is_exception,
          deprecated: entry.is_deprecated,
        }
      : []
  )
)
