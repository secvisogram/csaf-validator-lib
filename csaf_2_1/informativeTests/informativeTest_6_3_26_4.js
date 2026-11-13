import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        involvement: {
          additionalProperties: true,
          properties: {
            entities: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  name: { type: 'string' },
                },
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
 * This implements the informative test 6.3.26.4 of the CSAF 2.1 standard.
 *
 * For each entity it is tested the name was not already used for another
 * entity within the document.
 *
 * @param {unknown} doc
 */
export function informativeTest_6_3_26_4(doc) {
  const ctx = {
    infos: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const seen = new Set()
  doc.document.involvement.entities.forEach((item, index) => {
    if (item.name === undefined) return
    if (seen.has(item.name)) {
      ctx.infos.push({
        instancePath: `/document/involvement/entities/${index}/name`,
        message: `the name "${item.name}" is already used for another entity`,
      })
    }
    seen.add(item.name)
  })

  return ctx
}
