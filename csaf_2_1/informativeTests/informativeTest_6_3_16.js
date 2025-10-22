/*
  This test depends on the languagetool server to be available. See
  https://languagetool.org/de. A `compose.yml` file is available in the
  repository root to start an instance.
 */

import Ajv from 'ajv/dist/jtd.js'
import bcp47 from 'bcp47'
import { context } from '../../context.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        lang: { type: 'string' },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * If the document language is given it MUST be tested that a grammar check for
 * the given language does not find any mistakes. The test SHALL be skipped if
 * the document language is not set. It SHALL fail if the given language is not
 * supported.
 *
 * @param {unknown} doc
 * @returns
 */
export async function informativeTest_6_3_16(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const lang =
    (doc.document?.lang &&
      bcp47.parse(doc.document.lang)?.langtag.language.language) ??
    'en'

  /*
    Check if the language is supported by the languagetool server.
   */
  {
    /**
     * @typedef {object} Language
     * @property {string} code
     */

    /** @typedef {Language[]} Response */

    const res = await fetch(new URL('/v2/languages', context.languageToolUrl), {
      headers: {
        accept: 'application/json',
      },
    })
    if (!res.ok) throw new Error('request to languagetool failed')

    const json = /** @type {Response} */ (await res.json())

    if (!json.some((l) => l.code === lang)) {
      ctx.infos.push({
        instancePath: '/document/lang',
        message: 'language is not supported',
      })
    }
  }

  for (const path of [
    '/document/acknowledgments[]/summary',
    '/document/aggregate_severity/text',
    '/document/distribution/text',
    '/document/notes[]/audience',
    '/document/notes[]/text',
    '/document/notes[]/title',
    '/document/publisher/issuing_authority',
    '/document/references[]/summary',
    '/document/title',
    '/document/tracking/revision_history[]/summary',
    '/product_tree/product_groups[]/summary',
    '/vulnerabilities[]/acknowledgments[]/summary',
    '/vulnerabilities[]/involvements[]/summary',
    '/vulnerabilities[]/notes[]/audience',
    '/vulnerabilities[]/notes[]/text',
    '/vulnerabilities[]/notes[]/title',
    '/vulnerabilities[]/references[]/summary',
    '/vulnerabilities[]/remediations[]/details',
    '/vulnerabilities[]/remediations[]/entitlements[]',
    '/vulnerabilities[]/remediations[]/restart_required/details',
    '/vulnerabilities[]/threats[]/details',
    '/vulnerabilities[]/title',
  ]) {
    await checkPath(
      [],
      path.split('/').slice(1),
      doc,
      async (instancePath, text) => {
        if (typeof text !== 'string') return
        const result = await checkString(text, lang)
        if (result.length) {
          ctx.infos.push({
            instancePath,
            message: result.map((r) => r.message).join(' '),
          })
        }
      }
    )
  }

  return ctx
}

/**
 * Checks the value behind `path` using the given `onCheck` function. This is a
 * recursive helper function to loop through the list of paths in the spec.
 *
 * @param {string[]} reminder
 * @param {string[]} path
 * @param {unknown} value
 * @param {(instancePath: string, value: string) => Promise<void>} onCheck
 */
async function checkPath(reminder, path, value, onCheck) {
  if (value == null) return
  const currentSegment = path.at(0)

  if (!currentSegment) {
    // We've reached the end. Now the `onCheck` function can be called to check
    // the actual value.
    if (typeof value === 'string') {
      await onCheck('/' + reminder.join('/'), value)
    }
  } else if (currentSegment.endsWith('[]')) {
    // The value is supposed to be an array for which every element needs to be
    // checked ...
    const arrayName = currentSegment.split('[')[0]
    const array = Reflect.get(value, arrayName)

    if (Array.isArray(array)) {
      // ... But only if it's really an array.
      for (const [elementIndex, element] of array.entries() ?? []) {
        await checkPath(
          [...reminder, arrayName, String(elementIndex)],
          [...path.slice(1)],
          element,
          onCheck
        )
      }
    }
  } else {
    // Otherwise it's something object-ish which we traverse recursively.
    await checkPath(
      [...reminder, currentSegment],
      path.slice(1),
      Reflect.get(value, currentSegment),
      onCheck
    )
  }
}

/**
 * Check the given string using the languagetool server.
 *
 * @param {string} str
 * @param {string} lng
 * @returns
 */
async function checkString(str, lng) {
  /**
   * @typedef {object} Match
   * @property {string} message
   */

  /**
   * @typedef {object} Response
   * @property {Match[]} matches
   */

  const res = await fetch(new URL('/v2/check', context.languageToolUrl), {
    method: 'POST',
    body: new URLSearchParams([
      ['language', lng],
      ['text', str],
    ]),
  })
  if (!res.ok) throw new Error('request to languagetool failed')

  const json = /** @type {Response} */ (await res.json())
  return json.matches
}
