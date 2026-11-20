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

// Standard dictionaries do not know the name of the standard itself, which
// also appears as part of the category value "csaf_base".
const ALLOWED_WORDS = new Set(['CSAF', 'csaf'])
const HUNSPELL_MISSPELLED_RE = /^[#&] (\S+)/

/**
 * Informative test 6.3.8: Check for spelling mistakes in text fields.
 *
 * All text fields are collected and checked with a single hunspell invocation.
 * Hunspell does the tokenizing itself (one input line per field), so words
 * like "wrold.txt" or "Secruity's" are split by its rules. The output has one
 * block per input line, terminated by a blank line.
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

  /** @type {Array<{ instancePath: string; text: string }>} */
  const fields = []
  /**
   * @param {string} instancePath
   * @param {string} text
   */
  const collect = (instancePath, text) => {
    // Newlines would split a field into several hunspell input lines
    const line = text.replace(/\s+/g, ' ').trim()
    if (line) fields.push({ instancePath, text: line })
  }

  for (const path of TEXT_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string') collect(instancePath, value)
    })
  }
  if (doc.document?.category === 'csaf_base') {
    collect('/document/category', doc.document.category)
  }

  /** @type {string} */
  let output
  try {
    // Also serves as the check whether the dictionary is available. The "^"
    // prefix stops hunspell from interpreting a word as a pipe-mode command.
    output = await params.hunspell({
      dictionary,
      input: fields.map((f) => `^${f.text}`).join('\n'),
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

  // Skip the version header; each input line yields one block of result lines
  // terminated by a blank line.
  const blocks = output.split(/\r?\n/).slice(1)
  let fieldIndex = 0
  /** @type {Set<string>} */
  let mistakes = new Set()
  for (const line of blocks) {
    if (line === '') {
      const field = fields[fieldIndex++]
      if (field && mistakes.size) {
        ctx.infos.push({
          instancePath: field.instancePath,
          message: `there are spelling mistakes in: ${[...mistakes].join(
            ', '
          )}`,
        })
      }
      mistakes = new Set()
      continue
    }
    if (!line.startsWith('# ') && !line.startsWith('& ')) continue
    const match = HUNSPELL_MISSPELLED_RE.exec(line)
    if (!match) {
      ctx.infos.length = 0
      ctx.infos.push({
        instancePath: '/document/lang',
        message: 'Error while parsing hunspell output',
      })
      return ctx
    }
    if (!ALLOWED_WORDS.has(match[1])) mistakes.add(match[1])
  }

  return ctx
}
