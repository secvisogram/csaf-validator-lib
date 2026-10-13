import { Ajv } from 'ajv/dist/jtd.js'
import { parse } from '#lib/spdx/spdx.js'
import { exceptions, licenses } from '@secvisogram/license-deprecation-list'
/** @typedef {import('@secvisogram/license-deprecation-list').LicenseEntry} LicenseEntry */

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
const ABOUT_CODE_EXCEPTION_REF_PREFIX = 'AdditionRef-scancode-'

const validateSchema = ajv.compile(inputSchema)

/**
 * Check whether license identifiers are listed as deprecated Aboutcode's "ScanCode LicenseDB"
 * @param {string} licenseRefToCheck
 * @return {LicenseEntry | undefined}
 */
function isDeprecatedAboutCodeLicense(licenseRefToCheck) {
  if (!licenseRefToCheck.startsWith(ABOUT_CODE_LICENSE_REF_PREFIX)) {
    return undefined
  } else {
    const licenseKey = licenseRefToCheck.substring(
      ABOUT_CODE_LICENSE_REF_PREFIX.length
    )
    const license = licenses.get(licenseKey)
    return license?.is_deprecated && license?.source === 'aboutCode'
      ? license
      : undefined
  }
}

/**
 * Check whether license identifiers are listed in SPDX deprecated license list.
 * @param {string} licenseToCheck
 * @return {LicenseEntry | undefined}
 */
function isDeprecatedSpdxLicense(licenseToCheck) {
  const license = licenses.get(licenseToCheck)
  return license?.is_deprecated && license?.source === 'spdx'
    ? license
    : undefined
}

/**
 * Check whether an exception identifier is listed in the SPDX deprecated exception list
 * @param {string} exceptionId
 * @return {LicenseEntry | undefined}
 */
function isDeprecatedSpdxException(exceptionId) {
  const exception = exceptions.get(exceptionId)
  return exception?.is_deprecated && exception?.source === 'spdx'
    ? exception
    : undefined
}

/**
 * Check whether an AdditionRef-scancode-* identifier is listed in AboutCode's
 * Deprecated "ScanCode LicenseDB" exceptions
 * @param {string} additionRefToCheck - full identifier, e.g. "AdditionRef-scancode-autoconf-exception-2.0"
 * @return {LicenseEntry | undefined}
 */
function isDeprecatedAboutCodeException(additionRefToCheck) {
  if (!additionRefToCheck.startsWith(ABOUT_CODE_EXCEPTION_REF_PREFIX)) {
    return undefined
  } else {
    const exceptionKey = additionRefToCheck.substring(
      ABOUT_CODE_EXCEPTION_REF_PREFIX.length
    )
    const exception = exceptions.get(exceptionKey)
    return exception?.is_deprecated && exception?.source === 'aboutCode'
      ? exception
      : undefined
  }
}

/**
 * Recursively checks if a parsed license expression contains Deprecated  licenses
 * or exceptions.
 *
 * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpression - The parsed license expression
 * @returns {Array<LicenseEntry>} all deprecated licenses and exceptions found
 */
function deprecatedLicenses(parsedExpression) {
  /** @type {Array<LicenseEntry>} */
  const deprecatedLicense = []
  if (parsedExpression.type === 'SIMPLE_EXPRESSION') {
    // Check the license identifier (LicenseRef-* that is not in AboutCode)
    if (
      parsedExpression.value?.type === 'LICENSE_REF' &&
      parsedExpression.value.keyword === 'LicenseRef'
    ) {
      const license = isDeprecatedAboutCodeLicense(
        'LicenseRef-' + parsedExpression.value.value
      )
      if (license) {
        deprecatedLicense.push(license)
      }
    }

    if (parsedExpression.value?.type === 'LICENSE') {
      const license = isDeprecatedSpdxLicense(parsedExpression.value?.value)
      if (license) {
        deprecatedLicense.push(license)
      }
    }

    // Check the WITH clause exception identifier.
    const withClause = parsedExpression.with
    if (withClause) {
      if (withClause.type === 'EXCEPTION') {
        const exception = isDeprecatedSpdxException(withClause.value)
        if (exception) {
          deprecatedLicense.push(exception)
        }
      } else if (withClause.type === 'ADDITION_REF') {
        // Full identifier: e.g. "AdditionRef-scancode-autoconf-exception-2.0"
        const fullAdditionRef = withClause.keyword + '-' + withClause.value
        // isAboutCodeException handles the prefix check internally (line 115)
        const exception = isDeprecatedAboutCodeException(fullAdditionRef)
        if (exception) {
          deprecatedLicense.push(exception)
        }
      }
    }
  } else {
    deprecatedLicense.push(...deprecatedLicenses(parsedExpression.left))
    deprecatedLicense.push(...deprecatedLicenses(parsedExpression.right))
  }

  return deprecatedLicense
}
/**
 * Check if the license_expression contains license identifiers or exceptions
 * that are deprecated in the SPDX license list or Aboutcode's "ScanCode LicenseDB"
 * When the license expression is not valid SPDX the check is skipped
 * (this is checked in 6.1.54)
 * @param {string | null | undefined} licenseToCheck - The license expression to check
 * @returns {Array<LicenseEntry>} all deprecated licenses and exceptions found,
 *                                empty array when the SPDX expression is not valid
 */
export function allDeprecatedInLicenseString(licenseToCheck) {
  // Validate ensures that no invalid SPDX licenses are present

  if (licenseToCheck) {
    try {
      const parseResult = parse(licenseToCheck)
      return deprecatedLicenses(parseResult)
    } catch (e) {
      return []
    }
  } else {
    return []
  }
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

  const deprecatedLicenses = allDeprecatedInLicenseString(licenseToCheck)

  deprecatedLicenses.forEach((license) => {
    ctx.warnings.push({
      instancePath: '/document/license_expression',
      message: `License Key "${license.license_key}" is deprecated since "${license.deprecated_since}"`,
    })
  })

  return ctx
}
