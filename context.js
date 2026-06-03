/**
 * @typedef {object} Context
 * @property {string} languageToolUrl The url to the language tool
 */

/**
 * This is the context that is used to execute the tests. Modify it when
 * initializing the library to change settings. Port 8010 is the default exposed
 * by the collabora/languagetool image in `dev/languagetool/compose.yml`.
 *
 * @type {Context}
 */
export const context = { languageToolUrl: 'http://localhost:8010' }
