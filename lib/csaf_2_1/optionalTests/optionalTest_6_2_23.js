import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cwes: {
            elements: {
              additionalProperties: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                version: { type: 'string' },
              }
            }
          }
        }
      }
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_22(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vi) => {
    vulnerability.cwes?.forEach((cwe, ci) => {
      if (cwe.name?.startsWith('DEPRECATED: ')) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${vi}/cwes/${ci}`,
          message: `The ${cwe.id} is deprecated in version ${cwe.version}`,
        })
      }
    })
  })

  return ctx
}
