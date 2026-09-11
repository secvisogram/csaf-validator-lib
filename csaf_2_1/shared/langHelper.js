import bcp47 from 'bcp47'

/**
 * Checks if the document language is English or unspecified
 *
 * @param {string | undefined} language - The language expression to check
 * @returns {boolean} True if the language is English or unspecified, false otherwise
 */
export function isLangEnglishOrUnspecified(language) {
  return (
    !language ||
    bcp47.parse(language)?.langtag.language.language?.toLowerCase() === 'en'
  )
}
