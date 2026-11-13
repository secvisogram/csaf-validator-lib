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
        optionalProperties: {
          title: { type: 'string' },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.39.13 of the CSAF 2.1 standard.
 *
 * It SHALL be tested that `$.vulnerabilities[*].title` exists when the
 * document category is `csaf_vulnerability_report`.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_39_13(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  const docCategoryCsafVulnerabilityReport = 'csaf_vulnerability_report'

  if (
    !validate(doc) ||
    doc.document.category !== docCategoryCsafVulnerabilityReport
  ) {
    return context
  }

  const vulnerabilities = doc.vulnerabilities ?? []
  vulnerabilities.forEach((vulnerability, vulnIndex) => {
    if (vulnerability.title === undefined) {
      context.warnings.push({
        instancePath: `/vulnerabilities/${vulnIndex}/title`,
        message: `for document category "${docCategoryCsafVulnerabilityReport}" the vulnerability should have a "title" element`,
      })
    }
  })

  return context
}
