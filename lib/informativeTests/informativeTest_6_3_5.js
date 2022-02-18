const Ajv = require('ajv/dist/jtd.js').default
const { walkHashes } = require('../shared/csafHelpers.js')

const ajv = new Ajv()

const hashSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    file_hashes: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})

const validateHash = ajv.compile(hashSchema)

/**
 * @param {unknown} doc
 * @returns
 */
module.exports = function (doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  walkHashes(doc, ({ path, hash }) => {
    if (!validateHash(hash)) return
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      if (typeof fileHash.value === 'string' && fileHash.value.length < 64) {
        ctx.infos.push({
          instancePath: `${path}/file_hashes/${fileHashIndex}/value`,
          message: 'use of short hash',
        })
      }
    })
  })

  return ctx
}
