const Ajv = require('ajv/dist/jtd').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cwe: {
            additionalProperties: true,
            properties: {},
          },
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
module.exports = function informativeTest_6_3_4(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    if (!vulnerability.cwe) {
      ctx.infos.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}`,
        message: 'missing cwe',
      })
    }
  })

  return ctx
}
