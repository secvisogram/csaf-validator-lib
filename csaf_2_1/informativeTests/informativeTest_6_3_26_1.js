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
 * This implements the informative test 6.3.26.1 of the CSAF 2.1 standard.
 *
 * For each vulnerability it is tested that it is covered by at least one action
 * of the involvement. An action without `dl_vuln_ids` covers all vulnerabilities.
 *
 * @param {unknown} doc
 */
export function informativeTest_6_3_26_1(doc) {
  const ctx = {
    infos: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const covered = new Set()
  for (const action of doc.document.involvement.actions) {
    if (action.dl_vuln_ids === undefined) return ctx
    action.dl_vuln_ids.forEach((id) => covered.add(id))
  }

  doc.vulnerabilities.forEach((vulnerability, index) => {
    if (
      vulnerability.dl_vuln_id === undefined ||
      !covered.has(vulnerability.dl_vuln_id)
    ) {
      ctx.infos.push({
        instancePath: `/vulnerabilities/${index}`,
        message: 'the vulnerability is not covered by the involvement',
      })
    }
  })

  return ctx
}
