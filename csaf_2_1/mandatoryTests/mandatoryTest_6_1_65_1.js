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
  },
  optionalProperties: {
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
 * This implements the mandatory test 6.1.65.1 of the CSAF 2.1 standard.
 *
 * For each document-local vuln ID referenced in an involvement action it is
 * tested that a vulnerability with the matching `dl_vuln_id` exists.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_65_1(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const definedIds = new Set(
    (doc.vulnerabilities ?? []).map((v) => v.dl_vuln_id)
  )

  doc.document.involvement.actions.forEach((action, actionIndex) => {
    ;(action.dl_vuln_ids ?? []).forEach((dlVulnId, idIndex) => {
      if (!definedIds.has(dlVulnId)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/document/involvement/actions/${actionIndex}/dl_vuln_ids/${idIndex}`,
          message: `the document-local vuln ID "${dlVulnId}" is not defined in the vulnerabilities`,
        })
      }
    })
  })

  return ctx
}
