/*
Script to read all SPDX and aboutcode licenses
 */

import fs from 'node:fs'

const ABOUTCODE_LICENSE_DB =
  'https://scancode-licensedb.aboutcode.org/index.json'
const SPDX_LICENSE_DB =
  'https://raw.githubusercontent.com/spdx/license-list-data/refs/heads/main/json/licenses.json'
const SPDX_LICENSE_EXCEPTION_DB =
  'https://raw.githubusercontent.com/spdx/license-list-data/refs/heads/main/json/exceptions.json'

const OUTPUT_FILE = '../lib/license/license_information.js'

/**
 * Read JSON from given URL
 * @param {string | URL | Request} dataUrl
 * @returns
 */
async function readJson(dataUrl) {
  /** @type {any} */
  const headers = { Accept: 'application/vnd.github.v3+json' }
  const response = await fetch(dataUrl, { headers })
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

/**
 * Read considered licenses and license exceptions from SPDX and About Code
 * @returns {Promise<Array<{license_key: string, is_deprecated: boolean,  is_exception: boolean, source: string}>>}
 */
async function readConsideredLicenses() {
  /** @type {Array<{ license_key: string; spdx_license_key: string, is_deprecated: boolean, is_exception: boolean }>} */
  const aboutcodeLicenses = await readJson(ABOUTCODE_LICENSE_DB)
  /** @type {{licenseListVersion:string, licenses: [{isDeprecatedLicenseId: boolean,licenseId: string, name: string}]}}  */
  const spdxLicenses = await readJson(SPDX_LICENSE_DB)
  /** @type {{licenseListVersion:string, exceptions: [{isDeprecatedLicenseId: boolean,licenseExceptionId: string, name: string}]}}  */
  const spdxLicenseExceptions = await readJson(SPDX_LICENSE_EXCEPTION_DB)

  /** type [{license_key: string, is_deprecated: boolean, is_exception: boolean, source: string}] */
  const consideredLicenses = aboutcodeLicenses.map((aboutCode) => {
    return {
      license_key: aboutCode.license_key,
      is_deprecated: aboutCode.is_deprecated,
      source: 'aboutCode',
      is_exception: aboutCode.is_exception,
    }
  })

  consideredLicenses.push(
    ...spdxLicenses.licenses.map((spdxitem) => {
      return {
        license_key: spdxitem.licenseId,
        is_deprecated: spdxitem.isDeprecatedLicenseId,
        source: 'spdx',
        is_exception: false,
      }
    })
  )

  consideredLicenses.push(
    ...spdxLicenseExceptions.exceptions.map((spdxitem) => {
      return {
        license_key: spdxitem.licenseExceptionId,
        is_deprecated: spdxitem.isDeprecatedLicenseId,
        source: 'spdx',
        is_exception: true,
      }
    })
  )
  return consideredLicenses
}

readConsideredLicenses().then((licenses) => {
  const licenseObject = { licenses: licenses }
  const pointsJson = 'export default ' + JSON.stringify(licenseObject)
  fs.writeFile(OUTPUT_FILE, pointsJson, (err) => {
    if (err) {
      console.log(err)
    }
  })
})
