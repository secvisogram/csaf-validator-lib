const Ajv = require('ajv/dist/jtd.js').default

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        references: {
          elements: {
            additionalProperties: true,
            properties: {},
          },
        },

        tracking: {
          additionalProperties: true,
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
  },
})

const referenceSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    category: { type: 'string' },
    url: { type: 'string' },
  },
})

const validate = ajv.compile(inputSchema)
const validateReference = ajv.compile(referenceSchema)

/**
 * @param {any} doc
 */
module.exports = function optionalTest_6_2_11(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validate(doc)) {
    ctx.warnings.push({
      message: 'missing canonical url',
      instancePath: '/document',
    })
    return ctx
  }

  const hasCanonicalURL = doc.document.references.some(
    (r) =>
      validateReference(r) &&
      r.category === 'self' &&
      r.url.endsWith(
        doc.document.tracking.id.toLowerCase().replace(/[^a-z0-9\+]/g, '_') +
          '.json'
      )
  )

  if (!hasCanonicalURL) {
    ctx.warnings.push({
      message: 'missing canonical url',
      instancePath: '/document',
    })
  }

  return ctx
}
