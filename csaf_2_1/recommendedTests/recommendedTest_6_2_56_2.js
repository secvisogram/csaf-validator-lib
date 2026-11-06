import { Ajv } from 'ajv/dist/jtd.js'
import { collectActionEntityRefs } from './shared/collectActionEntityRefs.js'

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
            entity_groups: {
              elements: {
                additionalProperties: true,
                properties: {
                  entity_group_id: { type: 'string' },
                },
                optionalProperties: {
                  summary: { type: 'string' },
                },
              },
            },
          },
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
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.56.2 of the CSAF 2.1 standard.
 *
 * For each entity group without a `summary` it is tested that its
 * `entity_group_id` is referenced somewhere within the document.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_56_2(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const involvement = doc.document.involvement
  // entity group IDs can only be referenced by actions
  const references = collectActionEntityRefs(involvement.actions ?? [])

  involvement.entity_groups.forEach((group, index) => {
    if (group.summary !== undefined) return

    if (!references.has(group.entity_group_id)) {
      ctx.warnings.push({
        instancePath: `/document/involvement/entity_groups/${index}/entity_group_id`,
        message: `the entity group ID "${group.entity_group_id}" is not used and the group has no summary`,
      })
    }
  })

  return ctx
}
