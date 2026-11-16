import { Ajv } from 'ajv/dist/jtd.js'
import bcp47 from 'bcp47'
import { walkPath } from '../../lib/walkPaths.js'
import runHunspell from '../../hunspell/runHunspell.js'

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

const TEXT_PATHS = [
  '/document/acknowledgments[]/names[]',
  '/document/acknowledgments[]/organization',
  '/document/acknowledgments[]/summary',
  '/document/aggregate_severity/text',
  '/document/distribution/text',
  '/document/involvement/actions[]/summary',
  '/document/involvement/entities[]/contact/details',
  '/document/involvement/entities[]/name',
  '/document/involvement/entity_groups[]/name',
  '/document/involvement/entity_groups[]/summary',
  '/document/notes[]/audience',
  '/document/notes[]/text',
  '/document/notes[]/title',
  '/document/publisher/contact/details',
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
  '/vulnerabilities[]/notes[]/audience',
  '/vulnerabilities[]/notes[]/text',
  '/vulnerabilities[]/notes[]/title',
  '/vulnerabilities[]/references[]/summary',
  '/vulnerabilities[]/remediations[]/details',
  '/vulnerabilities[]/remediations[]/entitlements[]',
  '/vulnerabilities[]/remediations[]/restart_required/details',
  '/vulnerabilities[]/threats[]/details',
  '/vulnerabilities[]/title',
]

const URL_RE = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi
const HUNSPELL_MISSPELLED_RE = /^[#&] (\S+)/

/**
 * Informative test 6.3.8: Check for spelling mistakes in text fields.
 *
 * For performance, all text fields are collected and split into words first.
 * The unique words of the whole document are then checked with a single
 * hunspell invocation and the result is mapped back to the fields.
 *
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
  const language = lang?.langtag.language.language
  if (!language) return ctx
  const dictionary = `${language}${
    typeof lang.langtag.region === 'string' ? `_${lang.langtag.region}` : ''
  }`

  /** @type {Array<{ instancePath: string; words: string[] }>} */
  const fields = []
  /**
   * @param {string} instancePath
   * @param {string} text
   */
  const collect = (instancePath, text) => {
    const words = segmentText(text, language)
    if (words.length) fields.push({ instancePath, words })
  }

  for (const path of TEXT_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string') collect(instancePath, value)
    })
  }
  if (doc.document?.category === 'csaf_base') {
    collect('/document/category', doc.document.category)
  }

  const uniqueWords = new Set(fields.flatMap((f) => f.words))

  /** @type {string} */
  let output
  try {
    // Also serves as the check whether the dictionary is available. The "^"
    // prefix stops hunspell from interpreting a word as a pipe-mode command.
    output = await params.hunspell({
      dictionary,
      input: [...uniqueWords].map((w) => `^${w}`).join('\n'),
    })
  } catch (e) {
    if (/** @type {any} */ (e)?.code === 'ENOENT') {
      ctx.infos.push({
        instancePath: '/document/lang',
        message: 'hunspell is not available, spell check was skipped',
      })
      return ctx
    }
    ctx.infos.push({
      instancePath: '/document/lang',
      message: `language "${doc.document.lang}" is not supported`,
    })
    return ctx
  }

  const misspelled = new Set()
  for (const line of output.split('\n').slice(1)) {
    if (!line.startsWith('# ') && !line.startsWith('& ')) continue
    const match = HUNSPELL_MISSPELLED_RE.exec(line)
    if (!match) {
      ctx.infos.push({
        instancePath: '/document/lang',
        message: 'Error while parsing hunspell output',
      })
      return ctx
    }
    misspelled.add(match[1])
  }

  for (const { instancePath, words } of fields) {
    const mistakes = [...new Set(words.filter((w) => misspelled.has(w)))]
    if (mistakes.length) {
      ctx.infos.push({
        instancePath,
        message: `there are spelling mistakes in: ${mistakes.join(', ')}`,
      })
    }
  }

  return ctx
}

/**
 * Split a text into words. URLs are kept as whole tokens.
 * @param {string} text
 * @param {string} language
 * @returns {string[]}
 */
function segmentText(text, language) {
  const urls = text.match(URL_RE) ?? []
  const words = []
  for (const s of getSegmenter(language).segment(text.replace(URL_RE, ' '))) {
    if (s.isWordLike) words.push(s.segment)
  }
  return [...words, ...urls]
}

/** @type {Map<string, Intl.Segmenter>} */
const segmenters = new Map()
/** @param {string} language */
function getSegmenter(language) {
  let segmenter = segmenters.get(language)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language, { granularity: 'word' })
    segmenters.set(language, segmenter)
  }
  return segmenter
}
