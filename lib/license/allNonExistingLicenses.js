import { parse } from '#lib/spdx/spdx.js'
import { exceptions, licenses } from '@secvisogram/license-deprecation-list'

/** @typedef {import('@secvisogram/license-deprecation-list').LicenseEntry} LicenseEntry */

const ABOUT_CODE_LICENSE_REF_PREFIX = 'LicenseRef-scancode-'
const ABOUT_CODE_EXCEPTION_REF_PREFIX = 'AdditionRef-scancode-'

/**
 * Find a license identifier in Aboutcode's "ScanCode LicenseDB"
 * @param {string} licenseRefToCheck
 * @param {boolean} allowDeprecated
 * @return {LicenseEntry | undefined}
 */
function findAboutCodeLicense(licenseRefToCheck, allowDeprecated) {
  if (!licenseRefToCheck.startsWith(ABOUT_CODE_LICENSE_REF_PREFIX)) {
    return undefined
  } else {
    const licenseKey = licenseRefToCheck.substring(
      ABOUT_CODE_LICENSE_REF_PREFIX.length
    )
    /** @type {LicenseEntry | undefined} */
    const license = licenses.get(licenseKey)
    return (allowDeprecated || !license?.is_deprecated) &&
      license?.source === 'aboutCode'
      ? license
      : undefined
  }
}

/**
 * Find a license identifier in the SPDX license list.
 * @param {string} licenseToCheck
 * @param {boolean} allowDeprecated
 * @return {LicenseEntry | undefined}
 */
function findSpdxLicense(licenseToCheck, allowDeprecated) {
  /** @type {LicenseEntry | undefined} */
  const license = licenses.get(licenseToCheck)
  return (allowDeprecated || !license?.is_deprecated) &&
    license?.source === 'spdx'
    ? license
    : undefined
}

/**
 * Find an exception identifier in the SPDX exception list
 * @param {string} exceptionId
 * @param {boolean} allowDeprecated
 * @return {LicenseEntry | undefined}
 */
function findSpdxException(exceptionId, allowDeprecated) {
  /** @type {LicenseEntry | undefined} */
  const exception = exceptions.get(exceptionId)
  return (allowDeprecated || !exception?.is_deprecated) &&
    exception?.source === 'spdx'
    ? exception
    : undefined
}

/**
 * Find an AdditionRef-scancode-* identifier in AboutCode's
 * "ScanCode LicenseDB" exceptions
 * @param {string} additionRefToCheck - full identifier, e.g. "AdditionRef-scancode-autoconf-exception-2.0"
 * @param {boolean} allowDeprecated
 * @return {LicenseEntry | undefined}
 */
function findAboutCodeException(additionRefToCheck, allowDeprecated) {
  if (!additionRefToCheck.startsWith(ABOUT_CODE_EXCEPTION_REF_PREFIX)) {
    return undefined
  } else {
    const exceptionKey = additionRefToCheck.substring(
      ABOUT_CODE_EXCEPTION_REF_PREFIX.length
    )
    /** @type {LicenseEntry | undefined} */
    const exception = exceptions.get(exceptionKey)
    return (allowDeprecated || !exception?.is_deprecated) &&
      exception?.source === 'aboutCode'
      ? exception
      : undefined
  }
}

/**
 * Recursively checks if a parsed license expression contains unlisted licenses
 * or exceptions.
 *
 * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpression - The parsed license expression
 * @param {boolean} allowDeprecated
 * @returns {Array<string>} all unlisted licenses and exceptions found
 */
function notListedLicenses(parsedExpression, allowDeprecated) {
  /** @type {Array<string>} */
  const notListed = []
  if (parsedExpression.type === 'SIMPLE_EXPRESSION') {
    // Check the license identifier (LicenseRef-* that is not in AboutCode)
    if (
      parsedExpression.value?.type === 'LICENSE_REF' &&
      parsedExpression.value.keyword === 'LicenseRef'
    ) {
      const license = findAboutCodeLicense(
        'LicenseRef-' + parsedExpression.value.value,
        allowDeprecated
      )
      if (!license) {
        notListed.push(parsedExpression.value.value)
      }
    }

    if (parsedExpression.value?.type === 'LICENSE') {
      const license = findSpdxLicense(
        parsedExpression.value?.value,
        allowDeprecated
      )
      if (!license && parsedExpression.value?.value) {
        notListed.push(parsedExpression.value?.value)
      }
    }

    // Check the WITH clause exception identifier.
    const withClause = parsedExpression.with
    if (withClause) {
      if (withClause.type === 'EXCEPTION') {
        const exception = findSpdxException(withClause.value, allowDeprecated)
        if (!exception) {
          notListed.push(withClause.value)
        }
      } else if (withClause.type === 'ADDITION_REF') {
        // Full identifier: e.g. "AdditionRef-scancode-autoconf-exception-2.0"
        const fullAdditionRef = withClause.keyword + '-' + withClause.value
        // findAboutCodeException handles the prefix check internally (line 86)
        const exception = findAboutCodeException(
          fullAdditionRef,
          allowDeprecated
        )
        if (!exception) {
          notListed.push(fullAdditionRef)
        }
      }
    }
  } else {
    notListed.push(...notListedLicenses(parsedExpression.left, allowDeprecated))
    notListed.push(
      ...notListedLicenses(parsedExpression.right, allowDeprecated)
    )
  }

  return notListed
}
/**
 * Check if the license_expression contains license identifiers or exceptions
 * that do NOT exist in the SPDX license list or Aboutcode's "ScanCode LicenseDB"
 * When the license expression is not valid SPDX the check is skipped
 * @param {string | null | undefined} licenseToCheck - The license expression to check
 * @param {boolean} [allowDeprecated] - treat deprecated identifiers as listed
 * @returns {Array<string>} all unlisted licenses and exceptions found,
 *                                empty array when the SPDX expression is not valid
 */
export function allNonExistingLicenses(
  licenseToCheck,
  allowDeprecated = false
) {
  // Validate ensures that no invalid SPDX licenses are present

  if (licenseToCheck) {
    try {
      const parseResult = parse(licenseToCheck)
      return notListedLicenses(parseResult, allowDeprecated)
    } catch (e) {
      return []
    }
  } else {
    return []
  }
}
