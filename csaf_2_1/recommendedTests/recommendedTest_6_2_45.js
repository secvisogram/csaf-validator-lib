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
 * Find a license identifier in Aboutcode's "ScanCode LicenseDB"
 * @param {string} licenseRefToCheck
 * @return {LicenseEntry | undefined}
 */
function findAboutCodeLicense(licenseRefToCheck) {
  if (!licenseRefToCheck.startsWith(ABOUT_CODE_LICENSE_REF_PREFIX)) {
    return undefined
  } else {
    const licenseKey = licenseRefToCheck.substring(
      ABOUT_CODE_LICENSE_REF_PREFIX.length
    )
    /** @type {LicenseEntry | undefined} */
    const license = licenses.get(licenseKey)
    return !license?.is_deprecated && license?.source === 'aboutCode'
      ? license
      : undefined
  }
}

/**
 * Find a license identifier in the SPDX license list.
 * @param {string} licenseToCheck
 * @return {LicenseEntry | undefined}
 */
function findSpdxLicense(licenseToCheck) {
  /** @type {LicenseEntry | undefined} */
  const license = licenses.get(licenseToCheck)
  return !license?.is_deprecated && license?.source === 'spdx'
    ? license
    : undefined
}

/**
 * Find an exception identifier in the SPDX exception list
 * @param {string} exceptionId
 * @return {LicenseEntry | undefined}
 */
function findSpdxException(exceptionId) {
  /** @type {LicenseEntry | undefined} */
  const exception = exceptions.get(exceptionId)
  return !exception?.is_deprecated && exception?.source === 'spdx'
    ? exception
    : undefined
}

/**
 * Find an AdditionRef-scancode-* identifier in AboutCode's
 * "ScanCode LicenseDB" exceptions
 * @param {string} additionRefToCheck - full identifier, e.g. "AdditionRef-scancode-autoconf-exception-2.0"
 * @return {LicenseEntry | undefined}
 */
function findAboutCodeException(additionRefToCheck) {
  if (!additionRefToCheck.startsWith(ABOUT_CODE_EXCEPTION_REF_PREFIX)) {
    return undefined
  } else {
    const exceptionKey = additionRefToCheck.substring(
      ABOUT_CODE_EXCEPTION_REF_PREFIX.length
    )
    /** @type {LicenseEntry | undefined} */
    const exception = exceptions.get(exceptionKey)
    return !exception?.is_deprecated && exception?.source === 'aboutCode'
      ? exception
      : undefined
  }
}

/**
 * Recursively checks if a parsed license expression contains unlisted licenses
 * or exceptions.
 *
 * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpression - The parsed license expression
 * @returns {Array<string>} all unlisted licenses and exceptions found
 */
function notListedLicenses(parsedExpression) {
  /** @type {Array<string>} */
  const notListed = []
  if (parsedExpression.type === 'SIMPLE_EXPRESSION') {
    // Check the license identifier (LicenseRef-* that is not in AboutCode)
    if (
      parsedExpression.value?.type === 'LICENSE_REF' &&
      parsedExpression.value.keyword === 'LicenseRef'
    ) {
      const license = findAboutCodeLicense(
        'LicenseRef-' + parsedExpression.value.value
      )
      if (!license) {
        notListed.push(parsedExpression.value.value)
      }
    }

    if (parsedExpression.value?.type === 'LICENSE') {
      const license = findSpdxLicense(parsedExpression.value?.value)
      if (!license && parsedExpression.value?.value) {
        notListed.push(parsedExpression.value?.value)
      }
    }

    // Check the WITH clause exception identifier.
    const withClause = parsedExpression.with
    if (withClause) {
      if (withClause.type === 'EXCEPTION') {
        const exception = findSpdxException(withClause.value)
        if (!exception) {
          notListed.push(withClause.value)
        }
      } else if (withClause.type === 'ADDITION_REF') {
        // Full identifier: e.g. "AdditionRef-scancode-autoconf-exception-2.0"
        const fullAdditionRef = withClause.keyword + '-' + withClause.value
        // findAboutCodeException handles the prefix check internally (line 86)
        const exception = findAboutCodeException(fullAdditionRef)
        if (!exception) {
          notListed.push(fullAdditionRef)
        }
      }
    }
  } else {
    notListed.push(...notListedLicenses(parsedExpression.left))
    notListed.push(...notListedLicenses(parsedExpression.right))
  }

  return notListed
}
/**
 * Check if the license_expression contains license identifiers or exceptions
 * that do NOT exist in the SPDX license list or Aboutcode's "ScanCode LicenseDB"
 * When the license expression is not valid SPDX the check is skipped
 * @param {string | null | undefined} licenseToCheck - The license expression to check
 * @returns {Array<string>} all unlisted licenses and exceptions found,
 *                                empty array when the SPDX expression is not valid
 */
export function allNonExistingLicenses(licenseToCheck) {
  // Validate ensures that no invalid SPDX licenses are present

  if (licenseToCheck) {
    try {
      const parseResult = parse(licenseToCheck)
      return notListedLicenses(parseResult)
    } catch (e) {
      return []
    }
  } else {
    return []
  }
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

  const nonExistingLicenseIdentifier = allNonExistingLicenses(licenseToCheck)

  nonExistingLicenseIdentifier.forEach((licenseKey) => {
    ctx.warnings.push({
      instancePath: '/document/license_expression',
      message:
        `License identifier ${licenseKey} does not exist in ` +
        `the SPDX license list or Aboutcode's ScanCode LicenseDB`,
    })
  })

  return ctx
}
