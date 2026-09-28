import { Ajv } from 'ajv/dist/jtd.js'
import {
  containsOneNoteWithTitleAndCategory,
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
 * If the document language is specified but not English, it SHALL be tested that at least one item
 * in vulnerability notes exists that has the language specific translation of the term
 * "Vulnerability Summary" or "CVE Description" as title. The category of this item SHALL be
 * consistent with the required category for that title ("summary" respectively "description",
 * see the table of category/title combinations with special meaning). If no language specific
 * translation has been recorded, the test SHALL be skipped and output an information to the user
 * that no such translation is known.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_39_6(doc) {
  /*
      The `ctx` variable holds the state that is accumulated during the test run and is
      finally returned by the function.
     */
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

  const vulnerabilities = doc.vulnerabilities ?? []
  vulnerabilities.forEach((vulnerability, index) => {
    const notes = vulnerability.notes ?? []
    const hasMatchingNote =
      !!notes &&
      ((!!cveDescriptionInDocLang &&
        containsOneNoteWithTitleAndCategory(
          notes,
          cveDescriptionInDocLang,
          'description'
        )) ||
        (!!vulnerabilitySummaryInDocLang &&
          containsOneNoteWithTitleAndCategory(
            notes,
            vulnerabilitySummaryInDocLang,
            'summary'
          )))

    if (!hasMatchingNote) {
      ctx.warnings.push({
        instancePath: `/vulnerabilities/${index}/notes`,
        message:
          `for document category "${docCategoryCsafVulnerabilityReport}" at least one note must exist ` +
          `with title "${vulnerabilitySummaryInDocLang}" or "${vulnerabilitySummaryInDocLang}" and matching category "description" or "summary"`,
      })
    }

    notes.forEach((note, noteIndex) => {
      if (
        note.title === vulnerabilitySummaryInDocLang &&
        note.category !== 'summary'
      ) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${index}/notes/${noteIndex}`,
          message: `note with title "${vulnerabilitySummaryInDocLang}" has incorrect category "${note.category}"`,
        })
      }
      if (
        note.title === cveDescriptionInDocLang &&
        note.category !== 'description'
      ) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${index}/notes/${noteIndex}`,
          message: `note with title "${cveDescriptionInDocLang}" has incorrect category "${note.category}"`,
        })
      }
    })
  })

  return ctx
}
