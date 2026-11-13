import { Ajv } from 'ajv/dist/jtd.js'
import bcp47 from 'bcp47'

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
        category: {
          type: 'string',
        },
      },
      optionalProperties: {
        lang: { type: 'string' },
      },
    },
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

const validate = ajv.compile(inputSchema)

/*
  This is table 2 of section 3.2.4.10 of the CSAF 2.1 standard. It maps the
  titles that have a special meaning to the category that is required for a
  note with that title, restricted to the titles that are relevant for this
  test.
 */
const requiredCategoryByTitle = /** @type {const} */ ({
  'CVE Description': 'description',
  'Vulnerability Summary': 'summary',
})

/**
 * This implements the mandatory test 6.1.27.20 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_27_20(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (
    !validate(doc) ||
    doc.document.category !== 'csaf_vulnerability_report' ||
    //
    // The spec says that this test is activated only for documents with the language
    // english. Or if the language is unspecified.
    (doc.document.lang &&
      bcp47.parse(doc.document.lang)?.langtag.language.language !== 'en')
  )
    return ctx

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const summaryNotes =
      // Here we filter and map the vulnerability notes in one step using `flatMap`
      // to avoid double looping through the note array. The category is
      // not yet included in the filtering since it is checked below for each note
      // individually to improve the error messages.
      vulnerability.notes?.flatMap((n, i) =>
        n.title !== undefined &&
        Object.prototype.hasOwnProperty.call(requiredCategoryByTitle, n.title)
          ? { note: n, index: i }
          : []
      ) ?? []

    if (!summaryNotes.length) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/notes`,
        message:
          'needs at least one entry with the title "Vulnerability Summary" or "CVE Description"',
      })
    }

    for (const { note, index } of summaryNotes) {
      const requiredCategory =
        requiredCategoryByTitle[
          /** @type {keyof typeof requiredCategoryByTitle} */ (note.title)
        ]
      if (note.category !== requiredCategory) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/notes/${index}`,
          message: `the category of the "${note.title}" note must be "${requiredCategory}"`,
        })
      }
    }
  })

  return ctx
}
