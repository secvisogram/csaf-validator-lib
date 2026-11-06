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
                  category: { type: 'string' },
                  date: { type: 'string' },
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
 * This implements the recommended test 6.2.56.1 of the CSAF 2.1 standard.
 *
 * For each action with the category `confirmation` it is tested that its `date`
 * is later than or equal to the newest date of the actions it refers to through
 * `referenced_action_ids`. Dates are compared as instants, so timezones are
 * taken into account.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_56_1(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const actions = doc.document.involvement.actions
  const dateById = new Map(
    actions.map((action) => [action.action_id, Date.parse(action.date)])
  )

  actions.forEach((action, index) => {
    if (action.category !== 'confirmation') return

    const actionTime = Date.parse(action.date)
    const referencedTimes = (action.referenced_action_ids ?? [])
      .map((id) => dateById.get(id))
      .filter((time) => time !== undefined && !Number.isNaN(time))
    if (Number.isNaN(actionTime) || referencedTimes.length === 0) return

    const newest = Math.max(.../** @type {number[]} */ (referencedTimes))
    if (actionTime < newest) {
      ctx.warnings.push({
        instancePath: `/document/involvement/actions/${index}/date`,
        message:
          'the date of the confirmation is older than the newest action it refers to',
      })
    }
  })

  return ctx
}
