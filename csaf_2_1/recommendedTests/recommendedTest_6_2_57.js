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
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        involvement: {
          additionalProperties: true,
          optionalProperties: {
            actions: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  dl_vuln_ids: { elements: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.57 of the CSAF 2.1 standard.
 *
 * For each `dl_vuln_id` in the vulnerabilities it is tested that it is
 * referenced by at least one `dl_vuln_ids` item of an action in the
 * involvement.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_57(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const referenced = new Set(
    (doc.document?.involvement?.actions ?? []).flatMap(
      (action) => action.dl_vuln_ids ?? []
    )
  )

  doc.vulnerabilities.forEach((vulnerability, index) => {
    const id = vulnerability.dl_vuln_id
    if (id !== undefined && !referenced.has(id)) {
      ctx.warnings.push({
        instancePath: `/vulnerabilities/${index}/dl_vuln_id`,
        message: 'the document-local vuln ID is defined but never used',
      })
    }
  })

  return ctx
}
