import Ajv from 'ajv/dist/jtd.js'
import bcp47 from 'bcp47'
import { spawn } from 'child_process'
import { createInterface } from 'node:readline/promises'
import { EOL } from 'node:os'

const ajv = new Ajv()
// cache results of spell to improve perfromance
const spellCheckedWords2Result = new Map()
/**
 * @type {import("child_process").ChildProcessWithoutNullStreams}
 */
let hunspellSpawn
/**
 * @type {import("readline/promises").Interface}
 */
let hunspellInterface

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        lang: { type: 'string' },
      },
      optionalProperties: {
        acknowledgments: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              names: { elements: { type: 'string' } },
              organization: { type: 'string' },
              summary: { type: 'string' },
            },
          },
        },
        aggregate_severity: {
          additionalProperties: true,
          optionalProperties: {
            text: { type: 'string' },
          },
        },
        category: { type: 'string' },
        distribution: {
          additionalProperties: true,
          optionalProperties: {
            text: { type: 'string' },
          },
        },
        notes: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              audience: { type: 'string' },
              text: { type: 'string' },
              title: { type: 'string' },
            },
          },
        },
        publisher: {
          additionalProperties: true,
          optionalProperties: {
            issuing_authority: { type: 'string' },
            name: { type: 'string' },
          },
        },
        references: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              summary: { type: 'string' },
            },
          },
        },
        title: { type: 'string' },
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            aliases: {
              elements: {
                type: 'string',
              },
            },
            generator: {
              additionalProperties: true,
              optionalProperties: {
                engine: {
                  additionalProperties: true,
                  optionalProperties: {
                    name: { type: 'string' },
                  },
                },
              },
            },
            revision_history: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  summary: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: { elements: { additionalProperties: true, properties: {} } },
        full_product_names: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              name: { type: 'string' },
            },
          },
        },
        relationships: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: {
                additionalProperties: true,
                optionalProperties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        product_groups: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              summary: { type: 'string' },
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          acknowledgments: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                names: {
                  elements: {
                    type: 'string',
                  },
                },
                organization: { type: 'string' },
                summary: { type: 'string' },
              },
            },
          },
          involvements: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                summary: { type: 'string' },
              },
            },
          },
          notes: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                audience: { type: 'string' },
                text: { type: 'string' },
                title: { type: 'string' },
              },
            },
          },
          references: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                summary: { type: 'string' },
              },
            },
          },
          remediations: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                entitlements: {
                  elements: {
                    type: 'string',
                  },
                },
                details: { type: 'string' },
                restart_required: {
                  additionalProperties: true,
                  optionalProperties: {
                    details: { type: 'string' },
                  },
                },
              },
            },
          },
          threats: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                details: { type: 'string' },
              },
            },
          },
          title: { type: 'string' },
        },
      },
    },
  },
})
const validateInput = ajv.compile(inputSchema)

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    name: { type: 'string' },
    product: {
      additionalProperties: true,
      optionalProperties: {
        name: { type: 'string' },
      },
    },
  },
})
const validateBranch = ajv.compile(branchSchema)

/**
 * @param {any} doc
 * @param {object} [params]
 * @param {typeof runHunspell} params.hunspell
 */
export default async function informativeTest_6_3_8(
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
  if (!lang?.langtag.language.language) {
    return ctx
  }
  const dictionary = `${lang.langtag.language.language}${
    typeof lang.langtag.region === 'string' ? `_${lang.langtag.region}` : ''
  }`
  // @ts-ignore
  const segmenter = new Intl.Segmenter(lang.langtag.language, {
    granularity: 'word',
  })
  const urlPattern = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i

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
    '/product_tree/full_product_names[]/name',
    '/product_tree/product_groups[]/summary',
    '/product_tree/relationships[]/full_product_name/name',
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
    await checkPath(
      [],
      path.split('/').slice(1),
      doc,
      async (instancePath, value) => {
        await checkField(instancePath, value)
      }
    )
  }

  /**
   * @param {string} prefix
   * @param {unknown[]} branches
   */
  const checkBranches = async (prefix, branches) => {
    for (const [branchIndex, branch] of branches.entries()) {
      if (!validateBranch(branch)) {
        continue
      }

      await checkField(`${prefix}${branchIndex}/name`, branch.name)
      await checkField(
        `${prefix}${branchIndex}/product/name`,
        branch.product?.name
      )
      await checkBranches(
        `${prefix}${branchIndex}/branches/`,
        Array.isArray(branch.branches) ? branch.branches : []
      )
    }
  }

  await checkBranches(
    '/product_tree/branches/',
    doc.product_tree?.branches ?? []
  )

  /**
   * @param {string[]} reminder
   * @param {string[]} path
   * @param {any} value
   * @param {(instancePath: string, value: string) => Promise<void>} onCheck
   */
  async function checkPath(reminder, path, value, onCheck) {
    if (value == null) return
    const nextKey = path[0]

    if (!nextKey) {
      if (typeof value === 'string') {
        await onCheck('/' + reminder.join('/'), value)
      }
    } else if (nextKey.endsWith('[]')) {
      const arrayName = nextKey.split('[')[0]
      const array = value[arrayName]
      for (const [elementIndex, element] of array?.entries() ?? []) {
        await checkPath(
          [...reminder, arrayName, String(elementIndex)],
          [...path.slice(1)],
          element,
          onCheck
        )
      }
    } else {
      await checkPath(
        [...reminder, nextKey],
        path.slice(1),
        value[nextKey],
        onCheck
      )
    }
  }

  /**
   * @param {string} instancePath
   * @param {string} [text]
   */
  async function checkField(instancePath, text) {
    if (typeof text !== 'string') return

    // URL's are not properly segmented. Remove it before segmentation
    const textWithOutUrl = text.replace(urlPattern, '')

    const segmentedText = segmenter.segment(textWithOutUrl)
    const segments = [...segmentedText]
      .filter((s) => s.isWordLike)
      .map((s) => s.segment)

    const checkResults = []
    for (const segment of segments) {
      let spellCheckResult = spellCheckedWords2Result.get(segment)

      if (!spellCheckResult) {
        spellCheckResult = await spellCheckString({
          // @ts-ignore
          text: segment,
          dictionary: dictionary,
          hunspell: params.hunspell,
        })
        spellCheckedWords2Result.set(segment, spellCheckResult)
      }
      if (!spellCheckResult.ok) {
        checkResults.push(spellCheckResult)
      }
    }

    if (checkResults.length > 0) {
      const words = checkResults.flatMap((result) =>
        result.mistakes.map((/** @type {{ word: any; }} */ m) => m.word)
      )
      ctx.infos.push({
        instancePath,
        message: `there are spelling mistakes in: ${[...new Set(words)].join(
          ', '
        )}`,
      })
    }
  }

  if (hunspellSpawn) {
    hunspellInterface.close()
    hunspellSpawn.kill('SIGINT')
  }
  return ctx
}

/**
 * @param {object} params
 * @param {(params: { dictionary: string; input: string }) => Promise<string>} params.hunspell
 * @param {string} params.text
 * @param {string} params.dictionary
 */
async function spellCheckString({ text, dictionary, hunspell }) {
  /** @type {string} */
  const result = await hunspell({ dictionary, input: text })

  const lines = result.split('\n')
  const errors = lines
    .filter((l) => l.startsWith('# ') || l.startsWith('& '))
    .map((l) => {
      if (l.startsWith('& ')) {
        const regex = new RegExp(/^& ([^\s]+)/)
        const regexR = regex.exec(l)
        if (!regexR) throw new Error('Error while parsing hunspell output')
        return { word: regexR[1] }
      } else {
        const regex = new RegExp(/^# ([^\s]+)/)
        const regexR = regex.exec(l)
        if (!regexR) throw new Error('Error while parsing hunspell output')
        return { word: regexR[1] }
      }
    })
  return { mistakes: errors, ok: !errors.length }
}

/**
 * @param {object} params
 * @param {string} params.dictionary
 * @param {string} params.input
 * @returns
 */
async function runHunspell({ dictionary, input }) {
  // lacy initialize  hunspellSpawn
  if (!hunspellSpawn) {
    hunspellSpawn = spawn('hunspell', ['-d', dictionary], {
      stdio: 'pipe',
      shell: true,
    })
    hunspellInterface = createInterface(hunspellSpawn.stdout)
  }

  // @ts-ignore
  const result = await new Promise((resolve) => {
    /** @type {string[]} */
    const buffer = []
    /** @param {string} line */
    const handler = (line) => {
      if (line !== '') buffer.push(line)
      else {
        hunspellInterface.off('line', handler)
        resolve(buffer.join(EOL))
      }
    }
    hunspellInterface.on('line', handler)
    hunspellSpawn.stdin.write(input + EOL)
  })

  /** @type {string} */
  return result
}

/**
 * @param {object} params
 * @param {string} params.dictionary
 * @param {string} params.input
 * @returns
 */
async function runHunspellMock({ dictionary, input }) {
  return ''
}
