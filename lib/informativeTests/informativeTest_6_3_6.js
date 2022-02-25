const Ajv = require('ajv/dist/jtd.js').default
const { request } = require('undici')
const { walkHashes } = require('../shared/csafHelpers.js')

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
            properties: {
              url: { type: 'string' },
            },
            optionalProperties: {
              category: { type: 'string' },
            },
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
module.exports = async function informativeTest_6_3_6(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  for (let i = 0; i < doc.document.references.length; ++i) {
    const reference = doc.document.references[i]
    if (reference.category === 'self') continue
    const res = await request(reference.url, { method: 'HEAD' })
    if (res.statusCode !== 200) {
      ctx.infos.push({
        instancePath: `/document/references/${i}/url`,
        message: 'use of non-self referencing urls failing to resolve',
      })
    }
  }

  return ctx
}