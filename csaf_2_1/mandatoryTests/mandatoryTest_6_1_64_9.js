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
                  action_id: { type: 'string' },
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
 * This implements the mandatory test 6.1.64.9 of the CSAF 2.1 standard.
 *
 * For each referenced action id it is tested that an action with the
 * matching `action_id` exists.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_9(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const { actions } = doc.document.involvement
  const definedIds = new Set(actions.map((action) => action.action_id))

  actions.forEach((action, actionIndex) => {
    action.referenced_action_ids?.forEach((id, idIndex) => {
      if (!definedIds.has(id)) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/document/involvement/actions/${actionIndex}/referenced_action_ids/${idIndex}`,
          message: `action_id ${id} is not defined`,
        })
      }
    })
  })

  return ctx
}
