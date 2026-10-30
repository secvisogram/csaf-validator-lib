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
          optionalProperties: {
            actions: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  acting_entity_refs: { elements: { type: 'string' } },
                  receiving_entity_refs: { elements: { type: 'string' } },
                },
              },
            },
            entities: {
              elements: {
                additionalProperties: true,
                properties: {
                  entity_id: { type: 'string' },
                },
              },
            },
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
 * This implements the mandatory test 6.1.64.5 of the CSAF 2.1 standard.
 *
 * For each `entity_id` that is referenced from `acting_entity_refs`,
 * `receiving_entity_refs`, or `entity_groups[*].entity_ids` it is tested that
 * a matching entity exists in `document.involvement.entities`. References in
 * `acting_entity_refs`/`receiving_entity_refs` that match an
 * `entity_group_id` are ignored, since those reference an entity group
 * instead of a single entity.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_5(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const {
    actions,
    entities,
    entity_groups: entityGroups,
  } = doc.document.involvement

  const entityIds = new Set(
    /** @type {string[]} */ (entities?.map((entity) => entity.entity_id) ?? [])
  )
  const entityGroupIds = new Set(
    /** @type {string[]} */ (
      entityGroups?.map((group) => group.entity_group_id) ?? []
    )
  )

  /**
   * @param {string} instancePath
   * @param {string} entityId
   */
  function reportMissingEntity(instancePath, entityId) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath,
      message: `the entity_id '${entityId}' is not defined in the list of entities`,
    })
  }

  entityGroups?.forEach((group, groupIndex) => {
    group.entity_ids.forEach((entityId, entityIndex) => {
      if (!entityIds.has(entityId)) {
        reportMissingEntity(
          `/document/involvement/entity_groups/${groupIndex}/entity_ids/${entityIndex}`,
          entityId
        )
      }
    })
  })

  /**
   * @param {string[] | undefined} refs
   * @param {number} actionIndex
   * @param {string} propertyName
   */
  function checkEntityRefs(refs, actionIndex, propertyName) {
    refs?.forEach((ref, refIndex) => {
      if (entityGroupIds.has(ref)) return
      if (!entityIds.has(ref)) {
        reportMissingEntity(
          `/document/involvement/actions/${actionIndex}/${propertyName}/${refIndex}`,
          ref
        )
      }
    })
  }

  actions?.forEach((action, actionIndex) => {
    checkEntityRefs(
      action.acting_entity_refs,
      actionIndex,
      'acting_entity_refs'
    )
    checkEntityRefs(
      action.receiving_entity_refs,
      actionIndex,
      'receiving_entity_refs'
    )
  })

  return ctx
}
