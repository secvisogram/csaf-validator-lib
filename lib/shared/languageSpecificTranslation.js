import bcp47 from 'bcp47'
import translations from '../../lib/language_specific_translation/translations.js'

const translationMap = new Map(
  Object.entries(translations.translation).map(([key, value]) => [
    key,
    new Map(Object.entries(value)),
  ])
)

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
 * @param {Array<{ category?: string | undefined; title?: string | undefined; }>} notes
 * @param {string} titleToFind
 * @param {string} category
 * @returns {boolean} True if the language is valid, false otherwise
 */
export function containsOneNoteWithTitleAndCategory(
  notes,
  titleToFind,
  category
) {
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
 */
export function getTranslationInDocumentLang(doc, i18nKey) {
  if (!doc.document.lang) {
    return undefined
  }
  const language = bcp47.parse(doc.document.lang)?.langtag.language.language
  if (!language) {
    return undefined
  }
  return translationMap.get(language)?.get(i18nKey)
}
