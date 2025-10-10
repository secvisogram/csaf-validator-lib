import Ajv from 'ajv/dist/jtd.js'

import license_information from '../../lib/license/license_information.js'
import { validate, parse } from 'license-expressions'

const ajv = new Ajv()

const CONSIDERED_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => !license.deprecated)
    .map((license) => license.license_key)
)

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        license_expression: {
          type: 'string',
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * Recursively checks if a parsed license expression contains any license references.
 *
 * @param {import('license-expressions').ParsedSpdxExpression} parsedExpression - The parsed license expression
 * @returns {boolean} True if the expression contains any license references, false otherwise
 */
function containsLicenseRef(parsedExpression) {
  // If it's a LicenseRef type directly
  if ('licenseRef' in parsedExpression) {
    return true
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    return (
      containsLicenseRef(parsedExpression.left) ||
      containsLicenseRef(parsedExpression.right)
    )
  }

  // If it's a LicenseInfo type, it doesn't contain a license reference
  return false
}

/**
 * Checks if a license expression contains any license references.
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license expression contains any license references, false otherwise
 */
export function hasLicenseRef(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return containsLicenseRef(parseResult)
}

/**
 * Checks if a license is valid according to SPDX or AboutCode standards.
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license is valid, false otherwise
 */
export function checkLicense(licenseToCheck) {
  if (!licenseToCheck) {
    return false
  }

  // First do a simple check with aboutcode and spdx license ids
  // Then check whether the license is a valid SPDX license expression
  // Finally check if it contains any license references
  return (
    (CONSIDERED_LICENSE_KEYS.has(licenseToCheck) ||
      validate(licenseToCheck).valid) &&
    !hasLicenseRef(licenseToCheck)
  )
}

/**
 * It MUST be tested that the all license identifiers and exceptions are listed either
 * in the official SPDX license identifier list or AboutCode's "ScanCode LicenseDB".
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_17(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression

  if (!checkLicense(licenseToCheck)) {
    ctx.infos.push({
      instancePath: '/document/license_expression',
      message: `Invalid license expression: '${licenseToCheck}'`,
    })
  }

  return ctx
}
