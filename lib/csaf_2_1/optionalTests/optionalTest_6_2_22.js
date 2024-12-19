import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    title: {
      type: 'string'
    },
    tracking: {
      additionalProperties: true,
      optionalProperties: {
        id: {
          type: 'string'
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

  if (doc.title && doc?.tracking?.id) {
    if (doc.title.includes(doc.tracking.id)) {
      ctx.warnings.push({
        instancePath: '/document/title',
        message: 'The document title contains the document tracking id',
      })
    }
  }

  return ctx
}
