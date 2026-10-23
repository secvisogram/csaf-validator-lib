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
                properties: {
                  entity_id: { type: 'string' },
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
 * This implements the mandatory test 6.1.64.6 of the CSAF 2.1 standard.
 *
 * For each entity it is tested that the `entity_id` was not already defined
 * within the same document.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_6(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const seen = new Set()
  doc.document.involvement.entities.forEach((entity, index) => {
    if (seen.has(entity.entity_id)) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/document/involvement/entities/${index}/entity_id`,
        message: `entity_id ${entity.entity_id} was already defined`,
      })
    }
    seen.add(entity.entity_id)
  })

  return ctx
}
