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
                  referenced_action_ids: { elements: { type: 'string' } },
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
 * This implements the mandatory test 6.1.64.13 of the CSAF 2.1 standard.
 *
 * For each action with the category `confirmation` or `dispute` it is tested
 * that the element `referenced_action_ids` exists.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_13(doc) {
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
      ['confirmation', 'dispute'].includes(action.category) &&
      action.referenced_action_ids === undefined
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/document/involvement/actions/${index}`,
        message: `action of category ${action.category} must have referenced_action_ids`,
      })
    }
  })

  return ctx
}
