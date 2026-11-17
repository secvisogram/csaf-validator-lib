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
        involvement: {
          additionalProperties: true,
          properties: {
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
 * This implements the recommended test 6.2.56.4 of the CSAF 2.1 standard.
 *
 * For each action it is tested that it does not explicitly mention all
 * vulnerabilities of the document through `dl_vuln_ids`.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_56_4(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const vulnerabilities = doc.vulnerabilities
  // a vulnerability without dl_vuln_id can never be mentioned by an action
  if (
    vulnerabilities.length === 0 ||
    vulnerabilities.some((vuln) => vuln.dl_vuln_id === undefined)
  ) {
    return ctx
  }

  doc.document.involvement.actions.forEach((action, index) => {
    if (action.dl_vuln_ids === undefined) return

    const mentioned = new Set(action.dl_vuln_ids)
    if (vulnerabilities.every((vuln) => mentioned.has(`${vuln.dl_vuln_id}`))) {
      ctx.warnings.push({
        instancePath: `/document/involvement/actions/${index}/dl_vuln_ids`,
        message:
          'the action explicitly mentions all vulnerabilities of the document',
      })
    }
  })

  return ctx
}
