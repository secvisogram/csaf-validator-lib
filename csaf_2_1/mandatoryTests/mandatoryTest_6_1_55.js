import Ajv from 'ajv/dist/jtd.js'
import { parse, validate } from 'license-expressions'
import license_information from '../../lib/license/license_information.js'

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

const ENGLISH_LANGUAGES = [
  'en',
  'en-AU',
  'en-BZ',
  'en-CA',
  'en-CB',
  'en-IE',
  'en-JM',
  'en-NZ',
  'en-PH',
  'en-PH',
  'en-TT',
  'en-US',
  'en-ZA',
  'en-ZW',
]

const ABOUT_CODE_LICENSE_REF_PREFIX = 'LicenseRef-scancode-'

const ABOUT_CODE_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => !license.deprecated && license.source === 'aboutCode')
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
 * @returns {boolean} True if the expression contains any license references, false otherwise
 */
function containsNotListedLicenses(parsedExpression) {
  // If it's a LicenseRef type directly
  if ('licenseRef' in parsedExpression) {
    return !isAboutCodeLicense(parsedExpression.licenseRef)
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    return (
      containsNotListedLicenses(parsedExpression.left) ||
      containsNotListedLicenses(parsedExpression.right)
    )
  }

  // If it's a LicenseInfo type, it doesn't contain not listed licenses
  return false
}

/**
 * Checks if a license expression string contains any document references.
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license expression contains any document references, false otherwise
 */
function hasNotListedLicenses(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return containsNotListedLicenses(parseResult)
}

/**
 * check if the license_expression contains license identifiers or exceptions
 * that are not listed in the SPDX license list or Aboutcode's "ScanCode LicenseDB"
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license has not listed licenses, false otherwise
 */
export function existsNotListedLicenses(licenseToCheck) {
  return (
    !licenseToCheck ||
    (validate(licenseToCheck).valid && hasNotListedLicenses(licenseToCheck))
  )
}

/**
 * Checks if the document language is English or unspecified
 *
 * @param {string | undefined} language - The language expression to check
 * @returns {boolean} True if the language is valid, false otherwise
 */
export function isLangEnglishOrUnspecified(language) {
  return !language || ENGLISH_LANGUAGES.includes(language)
}

/**
 *  test whether exactly one item in document notes exists that has the title License. The category of this item MUST be legal_disclaimer.
 * @param {({} & { category?: string | undefined; title?: string | undefined; } & Record<string, unknown>)[]} notes
 * @returns {boolean} True if the language is valid, false otherwise
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
    if (existsNotListedLicenses(licenseToCheck)) {
      const notes = doc.document.notes
      if (!notes || !containsOneLegalNote(notes)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: '/document/notes',
          message:
            `The license_expression contains a license identifiers or exceptions that is not ` +
            `listed in Aboutcode's or  SPDX license list. Therefore exactly one note with ` +
            ` title 'License' and category 'legal_disclaimer' must exist`,
        })
      }
    }
  }

  return ctx
}
