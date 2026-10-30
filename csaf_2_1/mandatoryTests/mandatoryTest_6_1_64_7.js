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
            entity_groups: {
              elements: {
                additionalProperties: true,
                properties: {
                  entity_group_id: { type: 'string' },
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
 * This implements the mandatory test 6.1.64.7 of the CSAF 2.1 standard.
 *
 * For each entity group reference in `acting_entity_refs` and
 * `receiving_entity_refs` it is tested that a matching entity group exists.
 * References to entities (`EID-` prefix) are ignored.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_7(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const { actions = [], entity_groups: entityGroups = [] } =
    doc.document.involvement
  const groupIds = new Set(entityGroups.map((group) => group.entity_group_id))

  actions.forEach((action, actionIndex) => {
    for (const propertyName of /** @type {const} */ ([
      'acting_entity_refs',
      'receiving_entity_refs',
    ])) {
      action[propertyName]?.forEach((ref, refIndex) => {
        if (!ref.startsWith('EGID-') || groupIds.has(ref)) return
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `/document/involvement/actions/${actionIndex}/${propertyName}/${refIndex}`,
          message: `the entity_group_id '${ref}' is not defined in the list of entity groups`,
        })
      })
    }
  })

  return ctx
}
