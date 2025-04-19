import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const Nil_UUID = '00000000-0000-0000-0000-000000000000'

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
 * The Nil UUID should not be used for the sharing group id.
 * @param {any} doc
 */
export function optionalTest_6_2_29(doc) {
  const ctx = {
    warnings:
    /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }
  const sharingGroup = doc.document.distribution.sharing_group
  if (sharingGroup.id === Nil_UUID) {
    ctx.warnings.push({
      message: 'The Nil UUID should not be used for the sharing group id.',
      instancePath: `/document/distribution/sharing_group/id`,
    })
  }

  return ctx
}