import { Ajv } from 'ajv/dist/jtd.js'
import { execFile } from 'node:child_process'
import bcp47 from 'bcp47'
import { walkPath } from '../../lib/walkPaths.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        lang: { type: 'string' },
      },
    },
  },
})
const validateInput = ajv.compile(inputSchema)

// Profile categories defined in CSAF 2.1 §4 that are exempt from
// document/category spell-checking (they are machine-readable identifiers,
// not natural-language text).
const PROFILE_CATEGORIES = new Set([
  'csaf_base',
  'csaf_deprecated_security_advisory',
  'csaf_informational_advisory',
  'csaf_security_advisory',
  'csaf_security_incident_response',
  'csaf_superseded',
  'csaf_vex',
  'csaf_withdrawn',
])

// Spell-checking regexes for hunspell output.
const HUNSPELL_SUGGESTION_RE = /^& (\S+)/
const HUNSPELL_MISS_RE = /^# (\S+)/

/**
 * @param {any} doc
 * @param {object} [params]
 * @param {typeof runHunspell} params.hunspell
 */
export async function informativeTest_6_3_8(
  doc,
  params = { hunspell: runHunspell }
) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const lang = bcp47.parse(doc.document.lang)
  if (!lang?.langtag.language.language) return ctx
  const dictionary = `${lang.langtag.language.language}${
    typeof lang.langtag.region === 'string' ? `_${lang.langtag.region}` : ''
  }`

  try {
    await params.hunspell({ dictionary, input: '' })
  } catch {
    ctx.infos.push({
      instancePath: '/document/lang',
      message: `language "${doc.document.lang}" is not supported`,
    })
    return ctx
  }

  for (const path of [
    '/document/acknowledgments[]/names[]',
    '/document/acknowledgments[]/organization',
    '/document/acknowledgments[]/summary',
    '/document/aggregate_severity/text',
    '/document/distribution/text',
    '/document/notes[]/audience',
    '/document/notes[]/text',
    '/document/notes[]/title',
    '/document/publisher/issuing_authority',
    '/document/publisher/name',
    '/document/references[]/summary',
    '/document/title',
    '/document/tracking/aliases[]',
    '/document/tracking/generator/engine/name',
    '/document/tracking/revision_history[]/summary',
    '/product_tree/branches[*]/name',
    '/product_tree/branches[*]/product/name',
    '/product_tree/full_product_names[]/name',
    '/product_tree/product_groups[]/summary',
    '/product_tree/product_paths[]/full_product_name/name',
    '/vulnerabilities[]/acknowledgments[]/names[]',
    '/vulnerabilities[]/acknowledgments[]/organization',
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
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string') {
        await checkField(instancePath, value)
      }
    })
  }

  if (
    typeof doc.document?.category === 'string' &&
    !PROFILE_CATEGORIES.has(doc.document.category)
  ) {
    await checkField('/document/category', doc.document.category)
  }

  /**
   * Check a single text field for spelling mistakes and add an info message to
   * the context if any mistakes are found.
   * @param {string} instancePath
   * @param {string} text
   */
  async function checkField(instancePath, text) {
    const result = await spellCheckString({
      text,
      dictionary,
      hunspell: params.hunspell,
    })
    if (!result.ok) {
      ctx.infos.push({
        instancePath,
        message: `there are spelling mistakes in: ${result.mistakes
          .map((m) => m.word)
          .join(', ')}`,
      })
    }
  }

  return ctx
}

/**
 * Spell-check a string using hunspell and return the list of mistakes.
 * @param {object} params
 * @param {(params: { dictionary: string; input: string }) => Promise<string>} params.hunspell
 * @param {string} params.text
 * @param {string} params.dictionary
 */
async function spellCheckString({ text, dictionary, hunspell }) {
  /** @type {string} */
  const result = await hunspell({ dictionary, input: text })
  const lines = result.split('\n').slice(1)
  const errors = lines
    .filter((l) => l.startsWith('# ') || l.startsWith('& '))
    .map((l) => {
      if (l.startsWith('& ')) {
        const regexR = HUNSPELL_SUGGESTION_RE.exec(l)
        if (!regexR) throw new Error('Error while parsing hunspell output')
        return { word: regexR[1] }
      } else {
        const regexR = HUNSPELL_MISS_RE.exec(l)
        if (!regexR) throw new Error('Error while parsing hunspell output')
        return { word: regexR[1] }
      }
    })
  return { mistakes: errors, ok: !errors.length }
}

/**
 * Spell-check a string using hunspell and return the raw output.
 * @param {object} params
 * @param {string} params.dictionary
 * @param {string} params.input
 * @returns
 */
async function runHunspell({ dictionary, input }) {
  return await new Promise((resolve, reject) => {
    const child = execFile('hunspell', ['-d', dictionary], (err, stdout) => {
      if (err) return reject(err)
      resolve(stdout)
    })
    child.stdin?.end(input)
  })
}
