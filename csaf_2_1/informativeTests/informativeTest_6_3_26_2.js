import { Ajv } from 'ajv/dist/jtd.js'
import { collectActionEntityRefs } from '../recommendedTests/shared/collectActionEntityRefs.js'

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
          },
          properties: {
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
 * This implements the informative test 6.3.26.2 of the CSAF 2.1 standard.
 *
 * For each entity group it is tested that its `entity_group_id` is referenced
 * somewhere within the document.
 *
 * @param {unknown} doc
 */
export function informativeTest_6_3_26_2(doc) {
  const ctx = {
    infos: /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const refs = collectActionEntityRefs(doc.document.involvement.actions ?? [])

  doc.document.involvement.entity_groups.forEach((group, index) => {
    if (!refs.has(group.entity_group_id)) {
      ctx.infos.push({
        instancePath: `/document/involvement/entity_groups/${index}/entity_group_id`,
        message: `the entity group ID "${group.entity_group_id}" is defined but never used`,
      })
    }
  })

  return ctx
}
