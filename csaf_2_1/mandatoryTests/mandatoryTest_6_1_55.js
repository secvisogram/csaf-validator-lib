import { Ajv } from 'ajv/dist/jtd.js'
import { parse } from '#lib/spdx/spdx.js'
import { exceptions, licenses } from '@secvisogram/license-deprecation-list'
import { isLangEnglishOrUnspecified } from '../shared/langHelper.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
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
      optionalProperties: {
        lang: {
          type: 'string',
        },
        notes: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              category: {
                type: 'string',
              },
              title: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
})

const validateSchema = ajv.compile(inputSchema)

const ABOUT_CODE_LICENSE_REF_PREFIX = 'LicenseRef-scancode-'
const ABOUT_CODE_EXCEPTION_REF_PREFIX = 'AdditionRef-scancode-'

const SPDX_EXCEPTION_KEYS = new Set(
  [...exceptions.values()]
    .filter(
      (exception) =>
        exception.source === 'spdx' &&
        exception.is_exception &&
        !exception.deprecated_since
    )
    .map((exception) => exception.license_key)
)

const ABOUT_CODE_EXCEPTION_KEYS = new Set(
  [...exceptions.values()]
    .filter(
      (exception) =>
        exception.source === 'aboutCode' &&
        exception.is_exception &&
        !exception.deprecated_since
    )
    .map((exception) => exception.license_key)
)
const ABOUT_CODE_LICENSE_KEYS = new Set(
  [...licenses.values()]
    .filter(
      (license) =>
        license.source === 'aboutCode' &&
        !license.is_exception &&
        !license.deprecated_since
    )
    .map((license) => license.license_key)
)

const SPDX_LICENSE_KEYS = new Set(
  [...licenses.values()]
    .filter(
      (license) =>
        license.source === 'spdx' &&
        !license.is_exception &&
        !license.deprecated_since
    )
    .map((license) => license.license_key)
)

/**
 * Check whether license identifiers are listed Aboutcode's "ScanCode LicenseDB"
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
 * Check whether license identifiers are listed in SPDX license list
 * @param {string} licenseToCheck
 * @return {boolean}
 */
function isSpdxLicense(licenseToCheck) {
  //  remove trailing unary "+" operator
  return SPDX_LICENSE_KEYS.has(licenseToCheck.replace(/\+$/, ''))
}

/**
 * Check whether an exception identifier is listed in the SPDX exception list
 * @param {string} exceptionId
 * @return {boolean}
 */
function isSpdxException(exceptionId) {
  return SPDX_EXCEPTION_KEYS.has(exceptionId)
}

/**
 * Check whether an AdditionRef-scancode-* identifier is listed in AboutCode's
 * "ScanCode LicenseDB" exceptions
 * @param {string} additionRefToCheck - full identifier, e.g. "AdditionRef-scancode-autoconf-exception-2.0"
 * @return {boolean}
 */
function isAboutCodeException(additionRefToCheck) {
  if (!additionRefToCheck.startsWith(ABOUT_CODE_EXCEPTION_REF_PREFIX)) {
    return false
  } else {
    const exceptionKey = additionRefToCheck.substring(
      ABOUT_CODE_EXCEPTION_REF_PREFIX.length
    )
    return ABOUT_CODE_EXCEPTION_KEYS.has(exceptionKey)
  }
}

/**
 * Recursively checks if a parsed license expression contains not listed licenses
 * or exceptions.
 *
 * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpression - The parsed license expression
 * @returns {Array<string>} all not listed licenses and exceptions
 */
function notListedLicenses(parsedExpression) {
  /** @type {Array<string>} */
  const notListed = []
  if (parsedExpression.type === 'SIMPLE_EXPRESSION') {
    // Check the license identifier (LicenseRef-* that is not in AboutCode)
    if (
      parsedExpression.value?.type === 'LICENSE_REF' &&
      parsedExpression.value.keyword === 'LicenseRef' &&
      !isAboutCodeLicense('LicenseRef-' + parsedExpression.value.value)
    ) {
      notListed.push('LicenseRef-' + parsedExpression.value.value)
    }

    if (
      parsedExpression.value?.type === 'LICENSE' &&
      !isSpdxLicense(parsedExpression.value?.value)
    ) {
      notListed.push(parsedExpression.value.value)
    }

    // Check the WITH clause exception identifier.
    const withClause = parsedExpression.with
    if (withClause) {
      if (
        withClause.type === 'EXCEPTION' &&
        !isSpdxException(withClause.value)
      ) {
        // Plain exception id (e.g. "Classpath-exception-2.0") not in SPDX list
        notListed.push(withClause.value)
      } else if (withClause.type === 'ADDITION_REF') {
        // Full identifier: e.g. "AdditionRef-scancode-autoconf-exception-2.0"
        const fullAdditionRef = withClause.keyword + '-' + withClause.value
        // Only check AdditionRef-scancode-* identifiers against AboutCode
        if (
          fullAdditionRef.startsWith(ABOUT_CODE_EXCEPTION_REF_PREFIX) &&
          !isAboutCodeException(fullAdditionRef)
        ) {
          // AdditionRef-scancode-* not listed in AboutCode's ScanCode LicenseDB
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
 * Checks if a valid license expression string contains any not listed references.
 *
 * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpressionToCheck - The parsed license expression
 * @returns {Array<string>} all not listed licenses
 */
function allNotListedLicensesInValidExpression(parsedExpressionToCheck) {
  return notListedLicenses(parsedExpressionToCheck)
}

/**
 * Check if the license_expression contains license identifiers or exceptions
 * that are not listed in the SPDX license list or Aboutcode's "ScanCode LicenseDB"
 * When the license expression is not valid SPDX the check is skipped
 * (this is checked in 6.1.54)
 * @param {string} licenseToCheck - The license expression to check
 * @returns {Array<string>} all not listed licenses
 *                          empty array when the SPDX expression in not a valid
 */
export function getNotListedLicenses(licenseToCheck) {
  // Validate ensures that no invalid SPDX licenses are present

  if (licenseToCheck) {
    try {
      const parseResult = parse(licenseToCheck)
      return allNotListedLicensesInValidExpression(parseResult)
    } catch (e) {
      return []
    }
  } else {
    return []
  }
}

/**
 * Test whether exactly one item in document notes exists that has the title 'License'. The category of this item MUST be 'legal_disclaimer'.
 * @param {({} & { category?: string | undefined; title?: string | undefined; } & Record<string, unknown>)[]} notes
 * @returns {boolean} True there is exactly one note with title License and category legal_disclaimer
 */
function containsOneLegalNote(notes) {
  return (
    notes.filter(
      (note) => note.category === 'legal_disclaimer' && note.title === 'License'
    ).length === 1
  )
}

/**
 * It MUST be tested that the license expression is valid.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_55(doc) {
  /*
      The `ctx` variable holds the state that is accumulated during the test run and is
      finally returned by the function.
     */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateSchema(doc)) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression
  if (isLangEnglishOrUnspecified(doc.document.lang)) {
    const notListedLicenses = getNotListedLicenses(licenseToCheck)
    if (notListedLicenses.length > 0) {
      const notes = doc.document.notes
      if (!notes || !containsOneLegalNote(notes)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: '/document/notes',
          message:
            `The license_expression contains the following license identifiers that ` +
            `are nor listed in Aboutcode's or  SPDX license list: ` +
            `"${notListedLicenses.join(', ')}". ` +
            `Therefore exactly one note with ` +
            `title "License" and category "legal_disclaimer" must exist`,
        })
      }
    }
  }

  return ctx
}
