import Ajv from 'ajv/dist/jtd.js'
import { parse } from 'license-expressions'
import license_information from '../../lib/license/license_information.js'
import translations from '../../lib/language_specific_translation/translations.js'
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
    .filter((license) => license.source === 'aboutCode')
    .map((license) => license.license_key)
)

const SPDX_LICENSE_KEYS = new Set(
  license_information.licenses
    .filter((license) => license.source === 'spdx')
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

  if (
    'license' in parsedExpression &&
    !SPDX_LICENSE_KEYS.has(parsedExpression.license)
  ) {
    return true
  }

  if (
    'exception' in parsedExpression &&
    parsedExpression.exception &&
    !SPDX_LICENSE_KEYS.has(parsedExpression.exception)
  ) {
    return true
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
 * Checks if a license expression string contains any not listed licenses.
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
  return !!licenseToCheck && hasNotListedLicenses(licenseToCheck)
}

/**
 * Checks if the document language is specified and not English
 *
 * @param {string | undefined} language - The language expression to check
 * @returns {boolean} True if the language is valid, false otherwise
 */
export function isLangSpecifiedAndNotEnglish(language) {
  return (
    !!language && !(bcp47.parse(language)?.langtag.language.language === 'en')
  )
}

/**
 *  test whether exactly one item in document notes exists that has the given title.
 *  The category of this item MUST be legal_disclaimer.
 * @param {({} & { category?: string | undefined; title?: string | undefined; } & Record<string, unknown>)[]} notes
 * @param {string} titleToFind
 * @returns {boolean} True if the language is valid, false otherwise
 */
function containsOneLegalDisclaimerWithTitle(notes, titleToFind) {
  return (
    notes.filter(
      (note) =>
        note.category === 'legal_disclaimer' && note.title === titleToFind
    ).length === 1
  )
}

/**
 * Get the language specific translation of the term License
 * @param {{ document: { lang?: string; }; }} doc
 * @return {string | undefined}
 */
export function getLicenseInDocumentLang(doc) {
  if (!doc.document.lang) {
    return undefined
  }
  const language = bcp47.parse(doc.document.lang)?.langtag.language.language

  /** @type {Record<string, Record <string,string>>}*/
  const translationByLang = translations.translation
  if (!language || !translationByLang[language]) {
    return undefined
  } else {
    return translationByLang[language]['license']
  }
}

/**
 * If the document language is specified but not English, and the license_expression contains license
 * identifiers or exceptions that are not listed in the SPDX license list or Aboutcode's "ScanCode LicenseDB",
 * it MUST be tested that exactly one item in document notes exists that has the language specific translation
 * of the term License as title. The category of this item MUST be legal_disclaimer.
 * If no language-specific translation has been recorded, the test MUST be skipped
 * and output information to the user that no such translation is known.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_46(doc) {
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

  const licenseInDocLang = getLicenseInDocumentLang(doc)
  if (!licenseInDocLang) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression
  if (isLangSpecifiedAndNotEnglish(doc.document.lang)) {
    if (existsNotListedLicenses(licenseToCheck)) {
      const notes = doc.document.notes
      if (
        !notes ||
        !containsOneLegalDisclaimerWithTitle(notes, licenseInDocLang)
      ) {
        ctx.warnings.push({
          instancePath: '/document/notes',
          message:
            'The license_expression contains a license identifiers or exceptions that is not ' +
            'listed in Aboutcode or  SPDX license list. Therefore exactly one note with ' +
            'title "License" and category "legal_disclaimer" must exist',
        })
      }
    }
  }

  return ctx
}
