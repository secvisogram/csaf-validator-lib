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
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          dl_vuln_id: { type: 'string' },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the mandatory test 6.1.65.2 of the CSAF 2.1 standard.
 *
 * For each `dl_vuln_id` in the vulnerabilities it is tested that it was not
 * already defined within the same document.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_65_2(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const seen = new Set()
  doc.vulnerabilities.forEach((vulnerability, index) => {
    const id = vulnerability.dl_vuln_id
    if (id === undefined) return
    if (seen.has(id)) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/vulnerabilities/${index}/dl_vuln_id`,
        message: `the document-local vuln ID "${id}" was already defined`,
      })
    }
    seen.add(id)
  })

  return ctx
}
