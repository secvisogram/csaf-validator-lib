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
                optionalProperties: {
                  acting_entity_refs: { elements: { type: 'string' } },
                  receiving_entity_refs: { elements: { type: 'string' } },
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
 * This implements the mandatory test 6.1.64.4 of the CSAF 2.1 standard.
 *
 * For each action it is tested that no entity is acting and receiving entity
 * at the same time. Indirect relations through entity groups are considered.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_4(doc) {
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

  /**
   * Resolves entity ids and entity group ids to the set of contained entity ids.
   *
   * @param {string[]} refs
   */
  function resolveEntityIds(refs) {
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

  actions.forEach((action, index) => {
    if (!action.acting_entity_refs || !action.receiving_entity_refs) return

    const actors = resolveEntityIds(action.acting_entity_refs)
    const recipients = resolveEntityIds(action.receiving_entity_refs)
    const both = [...actors].filter((id) => recipients.has(id))

    if (both.length > 0) {
      ctx.isValid = false
      const entityWord = both.length > 1 ? 'entities' : 'entity'
      ctx.errors.push({
        instancePath: `/document/involvement/actions/${index}`,
        message: `the action contains ${both.join(
          ', '
        )} as acting and receiving ${entityWord}`,
      })
    }
  })

  return ctx
}
