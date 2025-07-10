import Ajv from 'ajv/dist/jtd.js'
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
        category: { type: 'string' },
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
 *  and the given category.
 * @param {({} & { category?: string | undefined; title?: string | undefined; } & Record<string, unknown>)[]} notes
 * @param {string} titleToFind
 * @param {string} category
 * @returns {boolean} True if the language is valid, false otherwise
 */
function containsOneNoteWithTitleAndCategory(notes, titleToFind, category) {
  return (
    notes.filter(
      (note) => note.category === category && note.title === titleToFind
    ).length === 1
  )
}

/**
 * Get the language specific translation of the given i18nKey
 * @param {{ document: { lang?: string; }; }} doc
 * @param {string} i18nKey
 * @return {string | undefined}
 */
export function getTranslationInDocumentLang(doc, i18nKey) {
  if (!doc.document.lang) {
    return undefined
  }
  const language = bcp47.parse(doc.document.lang)?.langtag.language.language

  /** @type {Record<string, Record <string,string>>}*/
  const translationByLang = translations.translation
  if (!language || !translationByLang[language]) {
    return undefined
  } else {
    return translationByLang[language][i18nKey]
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
export function recommendedTest_6_2_39_2(doc) {
  /*
      The `ctx` variable holds the state that is accumulated during the test run and is
      finally returned by the function.
     */
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  const noteCategory = 'description'

  if (!validateSchema(doc) || doc.document.category !== 'csaf_withdrawn') {
    return ctx
  }

  const withdrawalInDocLang = getTranslationInDocumentLang(
    doc,
    'reasoning_for_withdrawal'
  )
  if (!withdrawalInDocLang) {
    ctx.warnings.push({
      instancePath: '/document/notes',
      message:
        'no language specific translation for "Reasoning for Withdrawal" has been recorded',
    })
    return ctx
  }

  if (isLangSpecifiedAndNotEnglish(doc.document.lang)) {
    const notes = doc.document.notes
    if (
      !notes ||
      !containsOneNoteWithTitleAndCategory(
        notes,
        withdrawalInDocLang,
        'description'
      )
    ) {
      ctx.warnings.push({
        instancePath: '/document/notes',
        message:
          `for document category "csaf_withdrawn" exactly one note must exist ` +
          `with note category "${noteCategory}" and title "${withdrawalInDocLang}`,
      })
    }
  }

  return ctx
}
