import Ajv from 'ajv/dist/jtd.js'
import { parse, validate } from 'license-expressions'
import license_information from '../../lib/license/license_information.js'
import bcp47 from 'bcp47'

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

const ABOUT_CODE_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter(
      (license) => license.source === 'aboutCode' && !license.is_exception
    )
    .map((license) => license.license_key)
)

const ABOUT_CODE_EXCEPTION_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.source === 'aboutCode' && license.is_exception)
    .map((license) => license.license_key)
)

/**
 * Check whether license identifiers are not listed Aboutcode's "ScanCode LicenseDB"
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
 * Recursively checks if a parsed license expression contains not listed licenses.
 *
 * @param {import('license-expressions').ParsedSpdxExpression} parsedExpression - The parsed license expression
 * @returns {Array<string>} all not listed licenses
 */
function notListedLicenses(parsedExpression) {
  /** @type {Array<string>} */
  const deprecatedLicenses = []
  // If it's a LicenseRef type directly
  if ('licenseRef' in parsedExpression) {
    if (!isAboutCodeLicense(parsedExpression.licenseRef)) {
      deprecatedLicenses.push(parsedExpression.licenseRef)
    }
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    deprecatedLicenses.push(...notListedLicenses(parsedExpression.left))
    deprecatedLicenses.push(...notListedLicenses(parsedExpression.right))
  }

  // If it's a valid LicenseInfo type, it doesn't contain not listed license
  // Before we call this function we check that the whole expression is valid.
  // The expression is not valid, when it contains licences that are not listend
  // in the SPDX License List. (We check this in test 6.1.54)

  return deprecatedLicenses
}

/**
 * Checks if a valid license expression string contains any not listed references.
 *
 * @param {string} licenseToCheck - The valid license expression to check
 * @returns {Array<string>} all not listed licenses
 */
function allNotListedLicensesInValidExpression(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return notListedLicenses(parseResult)
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
  if (!licenseToCheck || !validate(licenseToCheck).valid) {
    return []
  } else {
    return allNotListedLicensesInValidExpression(licenseToCheck)
  }
}

/**
 * Checks if the document language is English or unspecified
 *
 * @param {string | undefined} language - The language expression to check
 * @returns {boolean} True if the language is valid, false otherwise
 */
export function isLangEnglishOrUnspecified(language) {
  return !language || bcp47.parse(language)?.langtag.language.language === 'en'
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
