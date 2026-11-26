import { Ajv } from 'ajv/dist/jtd.js'

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
    },
  },
  optionalProperties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the informative test 6.3.23.2 of the CSAF 2.1 standard.
 *
 * It SHALL be tested that the element `$.vulnerabilities[*].disclosure_date`
 * exists when the document category is `csaf_vulnerability_report`.
 *
 * @param {unknown} doc
 */
export function informativeTest_6_3_23_2(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const infos = []
  const context = { infos }

  const docCategoryCsafVulnReport = 'csaf_vulnerability_report'

  if (
    !validate(doc) ||
    doc.document.category !== docCategoryCsafVulnReport ||
    !Array.isArray(doc.vulnerabilities)
  ) {
    return context
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    if (vulnerability.disclosure_date === undefined) {
      context.infos.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/disclosure_date`,
        message:
          `for document category "${docCategoryCsafVulnReport}" every vulnerability ` +
          `should contain a "disclosure_date" element`,
      })
    }
  })

  return context
}
