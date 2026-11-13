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
            actions: {
              elements: {
                additionalProperties: true,
                properties: {
                  category: { type: 'string' },
                },
                optionalProperties: {
                  receiving_entity_refs: { elements: { type: 'string' } },
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

const CATEGORIES_REQUIRING_RECEIVER = new Set([
  'confirmation',
  'coordination',
  'dispute',
  'notification',
])

/**
 * This implements the mandatory test 6.1.64.1 of the CSAF 2.1 standard.
 *
 * For each action with the category `confirmation`, `coordination`, `dispute`
 * or `notification` it is tested that `receiving_entity_refs` exists.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_1(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.document.involvement.actions.forEach((action, index) => {
    if (
      CATEGORIES_REQUIRING_RECEIVER.has(action.category) &&
      action.receiving_entity_refs === undefined
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/document/involvement/actions/${index}`,
        message: `missing receiving_entity_refs for action of category ${action.category}`,
      })
    }
  })

  return ctx
}
