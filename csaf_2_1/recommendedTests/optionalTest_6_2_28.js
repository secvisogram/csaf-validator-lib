import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const MAX_UUID = 'ffffffff-ffff-ffff-ffff-ffffffffffff'

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        distribution: {
          additionalProperties: true,
          properties: {
            sharing_group: {
              additionalProperties: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})
const validateInput = ajv.compile(inputSchema)

/**
 * Test for the optional test 6.2.28
 * The Max UUID should not be used for the sharing group id.
 * @param {any} doc
 */
export function optionalTest_6_2_28(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }
  const sharingGroup = doc.document.distribution.sharing_group
  if (sharingGroup.id === MAX_UUID) {
    ctx.warnings.push({
      message: 'The MAX UUID should not be used for the sharing group id.',
      instancePath: `/document/distribution/sharing_group/id`,
    })
  }

  return ctx
}
