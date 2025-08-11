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

const DEPRECATED_ABOUT_CODE_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.deprecated && license.source === 'aboutCode')
    .map((license) => license.license_key)
)

const DEPRECATED_SPDX_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.deprecated && license.source === 'spdx')
    .map((license) => license.license_key)
)

const validateSchema = ajv.compile(inputSchema)

/**
 * Check whether the license identifiers ref is a deprecated AboutCode's license
 * Ignores other license inventorying entities
 * @param {string} licenseRefToCheck
 * @return {boolean}
 */
function isDeprecatedLicenseRef(licenseRefToCheck) {
  if (!licenseRefToCheck.startsWith(ABOUT_CODE_LICENSE_REF_PREFIX)) {
    return false
  } else {
    const licenseKey = licenseRefToCheck.substring(
      ABOUT_CODE_LICENSE_REF_PREFIX.length
    )
    return DEPRECATED_ABOUT_CODE_LICENSE_KEYS.has(licenseKey)
  }
}

/**
 * Recursively checks if a parsed license expression contains deprecated licenses
 *
 * @param {import('license-expressions').ParsedSpdxExpression} parsedExpression - The parsed license expression
 * @returns {Array<string>} all deprecated licenses
 */
function allDeprecatedLicenses(parsedExpression) {
  /** @type {Array<string>} */
  const deprecatedLicenses = []
  // If it's a LicenseRef type directly
  if (
    'licenseRef' in parsedExpression &&
    isDeprecatedLicenseRef(parsedExpression.licenseRef)
  ) {
    deprecatedLicenses.push(parsedExpression.licenseRef)
  }

  if (
    'license' in parsedExpression &&
    DEPRECATED_SPDX_LICENSE_KEYS.has(parsedExpression.license)
  ) {
    deprecatedLicenses.push(parsedExpression.license)
  }

  if (
    'exception' in parsedExpression &&
    parsedExpression.exception &&
    DEPRECATED_SPDX_LICENSE_KEYS.has(parsedExpression.exception)
  ) {
    deprecatedLicenses.push(parsedExpression.exception)
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    deprecatedLicenses.push(...allDeprecatedLicenses(parsedExpression.left))
    deprecatedLicenses.push(...allDeprecatedLicenses(parsedExpression.right))
  }

  // If it's a LicenseInfo type, it doesn't contain not listed licenses
  return deprecatedLicenses
}

/**
 * Checks if a license expression string contains deprecated licenses
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {Array<string>} all deprecated licenses
 */
export function allDeprecatedInLicenseString(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return allDeprecatedLicenses(parseResult)
}

/**
 * It MUST be tested that all license identifier and exceptions used are not deprecated.
 * This SHALL be tested for the SPDX license list and Aboutcode's "ScanCode LicenseDB".
 * The test MAY be skipped for other license inventorying entities.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_44(doc) {
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

  if (validate(licenseToCheck).valid) {
    const deprecatedLicenseIdentifiers =
      allDeprecatedInLicenseString(licenseToCheck)

    deprecatedLicenseIdentifiers.forEach((licenseKey) => {
      ctx.warnings.push({
        instancePath: '/document/license_expression',
        message: `License identifier ${licenseKey} is deprecated `,
      })
    })
  }

  return ctx
}
