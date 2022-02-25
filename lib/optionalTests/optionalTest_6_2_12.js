const Ajv = require('ajv/dist/jtd.js').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        lang: { type: 'string' },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
module.exports = function optionalTest_6_2_12(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validate(doc)) {
    ctx.warnings.push({
      message: 'missing document language',
      instancePath: '/document',
    })
  }

  return ctx
}
