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
 * This implements the mandatory test 6.1.64.11 of the CSAF 2.1 standard.
 *
 * For each action with referenced action ids it is tested that the action
 * does not end up in a circle.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_11(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const { actions } = doc.document.involvement
  /** @type {Map<string, string[]>} action_id -> referenced action ids */
  const referencesById = new Map()
  for (const { action_id, referenced_action_ids = [] } of actions) {
    const existing = referencesById.get(action_id) ?? []
    referencesById.set(action_id, [...existing, ...referenced_action_ids])
  }

  actions.forEach((action, index) => {
    if (
      action.referenced_action_ids?.length &&
      isPartOfCycle(referencesById, action.action_id)
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/document/involvement/actions/${index}`,
        message: `action ${action.action_id} is part of a circular reference`,
      })
    }
  })

  return ctx
}

/**
 * Tests if the action with the given id is part of a cycle.
 * @param {Map<string, string[]>} referencesById action_id -> referenced action ids
 * @param {string} actionId
 */
const isPartOfCycle = (referencesById, actionId) => {
  /** @type {Set<string>} */
  const visited = new Set()
  // ids without a matching action have no references
  const referencesOf = (/** @type {string} */ id) =>
    referencesById.get(id) ?? []
  const toVisit = [...referencesOf(actionId)]

  let currentId
  while ((currentId = toVisit.pop()) !== undefined) {
    if (currentId === actionId) return true
    // prevents endless loops for cycles that do not contain actionId
    if (visited.has(currentId)) continue
    visited.add(currentId)
    toVisit.push(...referencesOf(currentId))
  }
  return false
}
