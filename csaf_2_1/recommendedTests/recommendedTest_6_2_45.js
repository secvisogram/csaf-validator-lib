import Ajv from 'ajv/dist/jtd.js'
import { parse, validate } from 'license-expressions'
import license_information from '../../lib/license/license_information.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
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

const ABOUT_CODE_LICENSE_REF_PREFIX = 'LicenseRef-scancode-'

const ABOUT_CODE_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.source === 'aboutCode')
    .map((license) => license.license_key)
)

const SPDX_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.source === 'spdx')
    .map((license) => license.license_key)
)

const validateSchema = ajv.compile(inputSchema)

/**
 * Check whether the license identifier ref is listed in Aboutcode's "ScanCode LicenseDB"
 * @param {string} licenseRefToCheck
 * @return {boolean}
 */
function isAboutCodeLicense(licenseRefToCheck) {
  if (!licenseRefToCheck.startsWith(ABOUT_CODE_LICENSE_REF_PREFIX)) {
    return false
  } else {
    const licenseKey = licenseRefToCheck.substring(
      ABOUT_CODE_LICENSE_REF_PREFIX.length
    )
    return ABOUT_CODE_LICENSE_KEYS.has(licenseKey)
  }
}

/**
 * Recursively checks if a parsed license expression has not existing licenses
 *
 * @param {import('license-expressions').ParsedSpdxExpression} parsedExpression - The parsed license expression
 * @returns {Array<string>} all not existing licenses
 */
function allNonExistingLicenses(parsedExpression) {
  /** @type {Array<string>} */
  const nonExistingLicenses = []
  if (
    'licenseRef' in parsedExpression &&
    !isAboutCodeLicense(parsedExpression.licenseRef)
  ) {
    nonExistingLicenses.push(parsedExpression.licenseRef)
  }

  if (
    'license' in parsedExpression &&
    !SPDX_LICENSE_KEYS.has(parsedExpression.license)
  ) {
    nonExistingLicenses.push(parsedExpression.license)
  }

  if (
    'exception' in parsedExpression &&
    parsedExpression.exception &&
    !SPDX_LICENSE_KEYS.has(parsedExpression.exception)
  ) {
    nonExistingLicenses.push(parsedExpression.exception)
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    nonExistingLicenses.push(...allNonExistingLicenses(parsedExpression.left))
    nonExistingLicenses.push(...allNonExistingLicenses(parsedExpression.right))
  }

  return nonExistingLicenses
}

/**
 * Checks if a license expression string contains Non-Existing licenses
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {Array<string>} all Non-Existing licenses
 */
export function allNonExistingLicensesInLicenseString(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return allNonExistingLicenses(parseResult)
}

/**
 * It MUST be tested that all license identifier and exceptions used exist.
 * This SHALL be tested for the SPDX license list and Aboutcode's "ScanCode LicenseDB".
 * The test MAY be skipped for other license inventorying entities.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_45(doc) {
  /*
        The `ctx` variable holds the state that is accumulated during the test run and is
        finally returned by the function.
       */
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateSchema(doc)) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression

  const nonExistingLicenseIdentifier =
    allNonExistingLicensesInLicenseString(licenseToCheck)

  nonExistingLicenseIdentifier.forEach((licenseKey) => {
    ctx.warnings.push({
      instancePath: '/document/license_expression',
      message:
        `License identifier ${licenseKey} does not exist in` +
        `SPDX license list and Aboutcode's ScanCode LicenseDB`,
    })
  })

  return ctx
}
