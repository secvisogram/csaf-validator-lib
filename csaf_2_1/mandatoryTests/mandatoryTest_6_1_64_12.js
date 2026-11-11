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
                },
                optionalProperties: {
                  acting_entity_refs: { elements: { type: 'string' } },
                  receiving_entity_refs: { elements: { type: 'string' } },
                  referenced_action_ids: { elements: { type: 'string' } },
                },
              },
            },
          },
          optionalProperties: {
            entity_groups: {
              elements: {
                additionalProperties: true,
                properties: {
                  entity_group_id: { type: 'string' },
                  entity_ids: { elements: { type: 'string' } },
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
 * This implements the mandatory test 6.1.64.12 of the CSAF 2.1 standard.
 *
 * For each action with the category `confirmation` it is tested that all
 * acting entities are mentioned as receiving entities in each referenced
 * action. Indirect relations through entity groups are considered.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_12(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const { actions, entity_groups: entityGroups = [] } = doc.document.involvement

  /** @type {Map<string, string[]>} */
  const groupMembers = new Map()
  for (const group of entityGroups) {
    groupMembers.set(group.entity_group_id, group.entity_ids)
  }

  /** @type {Map<string, typeof actions>} */
  const actionsById = new Map()
  for (const action of actions) {
    const sameId = actionsById.get(action.action_id)
    if (sameId) sameId.push(action)
    else actionsById.set(action.action_id, [action])
  }

  actions.forEach((action, index) => {
    if (action.category !== 'confirmation') return
    // Self-referencing confirmations are already reported by test 6.1.64.11
    // (Circular Reference of Action ID), so skip them here
    if (action.referenced_action_ids?.includes(action.action_id)) return

    const allActingEntities = resolveEntityIds(
      action.acting_entity_refs,
      groupMembers
    )

    const referencedIds = action.referenced_action_ids ?? []
    for (const [refIndex, referencedId] of referencedIds.entries()) {
      for (const referenced of actionsById.get(referencedId) ?? []) {
        const recipients = resolveEntityIds(
          referenced.receiving_entity_refs,
          groupMembers
        )
        const unmentioned = [...allActingEntities].filter(
          (id) => !recipients.has(id)
        )
        if (unmentioned.length === 0) continue

        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/document/involvement/actions/${index}/referenced_action_ids/${refIndex}`,
          message: `${unmentioned.join(', ')} confirms in ${
            action.action_id
          } receiving action ${referencedId}, but ${referencedId} does not list ${
            unmentioned.length > 1 ? 'them' : 'it'
          } as receiving ${unmentioned.length > 1 ? 'entities' : 'entity'}`,
        })
      }
    }
  })

  return ctx
}

/**
 * @param {string[] | undefined} refs
 * @param {Map<string, string[]>} groupMembers
 * @returns {Set<string>}
 */
function resolveEntityIds(refs = [], groupMembers) {
  const entityIds = new Set()
  for (const ref of refs) {
    const members = groupMembers.get(ref)
    if (members) {
      members.forEach((memberId) => entityIds.add(memberId))
    } else {
      entityIds.add(ref)
    }
  }
  return entityIds
}
