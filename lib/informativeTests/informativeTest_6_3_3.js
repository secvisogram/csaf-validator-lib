const Ajv = require('ajv/dist/jtd').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cve: { type: 'string' },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {unknown} doc
 * @returns
 */
module.exports = function (doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    if (!vulnerability.cve) {
      ctx.infos.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}`,
        message: 'missing cve',
      })
    }
  })

  return ctx
}
