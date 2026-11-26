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
            entities: {
              elements: {
                additionalProperties: true,
                properties: {
                  entity_id: { type: 'string' },
                },
              },
            },
          },
          optionalProperties: {
            entity_groups: {
              elements: {
                additionalProperties: true,
                optionalProperties: {
                  entity_ids: { elements: { type: 'string' } },
                },
              },
            },
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
 * This implements the recommended test 6.2.56.3 of the CSAF 2.1 standard.
 *
 * For each entity it is tested that its `entity_id` is referenced somewhere
 * within the document.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_56_3(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const involvement = doc.document.involvement
  const references = collectActionEntityRefs(involvement.actions ?? [])
  // entities can also be referenced by the groups they are members of
  for (const group of involvement.entity_groups ?? []) {
    for (const id of group.entity_ids ?? []) references.add(id)
  }

  involvement.entities.forEach((entity, index) => {
    if (!references.has(entity.entity_id)) {
      ctx.warnings.push({
        instancePath: `/document/involvement/entities/${index}/entity_id`,
        message: `the entity ID "${entity.entity_id}" is defined but never used`,
      })
    }
  })

  return ctx
}
