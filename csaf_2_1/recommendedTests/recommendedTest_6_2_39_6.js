import { Ajv } from 'ajv/dist/jtd.js'
import {
  containsAtLeastOneNoteWithTitle,
  getTranslationInDocumentLang,
  isLangSpecifiedAndNotEnglish,
} from '../../lib/shared/languageSpecificTranslation.js'

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
      },
    },
  },
  optionalProperties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
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
  },
})

const validateSchema = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.39.6 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_39_6(doc) {
  /** @type { {warnings: Array<{ message: string; instancePath: string }>;
   * infos: Array<{ message: string; instancePath: string }>}} */
  const ctx = {
    warnings: [],
    infos: [],
  }

  const docCategoryCsafVulnerabilityReport = `csaf_vulnerability_report`

  if (
    !validateSchema(doc) ||
    doc.document.category !== docCategoryCsafVulnerabilityReport
  ) {
    return ctx
  }

  if (!isLangSpecifiedAndNotEnglish(doc.document.lang)) {
    return ctx
  }

  const cveDescriptionInDocLang = getTranslationInDocumentLang(
    doc,
    'cve_description'
  )
  const vulnerabilitySummaryInDocLang = getTranslationInDocumentLang(
    doc,
    'vulnerability_summary'
  )

  if (!cveDescriptionInDocLang && !vulnerabilitySummaryInDocLang) {
    ctx.infos.push({
      instancePath: '/vulnerabilities',
      message:
        'no language specific translation for "Vulnerability Summary" or "CVE Description" has been recorded',
    })
    return ctx
  }

  /** @type {Array<{ titleKey: string; category: string }>} */
  const knownTranslations = []

  if (cveDescriptionInDocLang) {
    knownTranslations.push({
      titleKey: cveDescriptionInDocLang,
      category: 'description',
    })
  }

  if (vulnerabilitySummaryInDocLang) {
    knownTranslations.push({
      titleKey: vulnerabilitySummaryInDocLang,
      category: 'summary',
    })
  }

  const vulnerabilities = doc.vulnerabilities ?? []
  vulnerabilities.forEach((vulnerability, index) => {
    const notes = vulnerability.notes ?? []
    const hasMatchingNote =
      !!notes &&
      knownTranslations.some(({ titleKey }) =>
        containsAtLeastOneNoteWithTitle(notes, titleKey)
      )

    if (!hasMatchingNote) {
      ctx.warnings.push({
        instancePath: `/vulnerabilities/${index}/notes`,
        message:
          `for document category "${docCategoryCsafVulnerabilityReport}" at least one note must exist ` +
          `with title ${knownTranslations
            .map(({ titleKey }) => `"${titleKey}"`)
            .join(' or ')}.`,
      })
    } else {
      notes.forEach((note, noteIndex) => {
        knownTranslations.forEach(({ titleKey, category }) => {
          if (note.title === titleKey && note.category !== category) {
            ctx.warnings.push({
              instancePath: `/vulnerabilities/${index}/notes/${noteIndex}`,
              message: `note with title "${titleKey}" should have category "${category}" but has "${note.category}"`,
            })
          }
        })
      })
    }
  })

  return ctx
}
