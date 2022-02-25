const Ajv = require('ajv/dist/jtd.js').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          involvements: {
            elements: {
              additionalProperties: true,
              properties: {},
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
module.exports = function optionalTest_6_2_7(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.involvements?.forEach((involvement, involvementIndex) => {
      if (!involvement.date) {
        ctx.warnings.push({
          message: 'missing date',
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/involvements/${involvementIndex}`,
        })
      }
    })
  })

  return ctx
}
