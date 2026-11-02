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
                  category: { type: 'string' },
                  date: { type: 'string' },
                  status: { type: 'string' },
                },
                optionalProperties: {
                  acting_entity_refs: { elements: { type: 'string' } },
                  dl_vuln_ids: { elements: { type: 'string' } },
                  group_ids: { elements: { type: 'string' } },
                  product_ids: { elements: { type: 'string' } },
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
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_groups: {
          elements: {
            additionalProperties: true,
            properties: {
              group_id: { type: 'string' },
              product_ids: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          dl_vuln_id: { type: 'string' },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the mandatory test 6.1.64.2 of the CSAF 2.1 standard.
 *
 * It is tested that items of the list of actions do not contradict each other.
 * Ignoring the `action_id`, two actions contradict each other if `category`,
 * `date` and the sets of entities, referenced actions, vulnerabilities and
 * products are the same, but the `status` differs. Groups are expanded and
 * dates are compared as points in time.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_64_2(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const { actions, entity_groups: entityGroups = [] } = doc.document.involvement
  const productGroups = doc.product_tree?.product_groups ?? []

  /** @type {Set<string>} */
  const allVulnIds = new Set()
  for (const vuln of doc.vulnerabilities ?? []) {
    if (vuln.dl_vuln_id) allVulnIds.add(vuln.dl_vuln_id)
  }

  // Create maps from group ids to their members for easy lookup.
  /** @type {Map<string, string[]>} */
  const entityGroupMembers = new Map(
    entityGroups.map((group) => [group.entity_group_id, group.entity_ids])
  )
  /** @type {Map<string, string[]>} */
  const productGroupMembers = new Map(
    productGroups.map((group) => [group.group_id, group.product_ids])
  )

  /**
   * Turns a list into a canonical string of a set: duplicates removed and
   * sorted, so the order of the values does not matter when comparing.
   * @param {Iterable<string>} values
   */
  const canonicalSet = (values) => JSON.stringify([...new Set(values)].sort())

  /**
   * Replaces every group id by its members; ids that are not a group stay as is.
   * @param {string[] | undefined} refs
   * @param {Map<string, string[]>} groups
   */
  const expand = (refs = [], groups) =>
    refs.flatMap((ref) => groups.get(ref) ?? [ref])

  /**
   * A missing field and a field mentioning all vulnerabilities of the document
   * are equivalent, so both are normalized to the empty set.
   * @param {string[] | undefined} vulnIds
   */
  const canonicalVulnIds = (vulnIds) => {
    const ids = new Set(vulnIds ?? [])
    const mentionsAll =
      allVulnIds.size > 0 && [...allVulnIds].every((id) => ids.has(id))
    return canonicalSet(!vulnIds || mentionsAll ? [] : ids)
  }

  // Groups actions by a key built from all fields that have to be equal.
  /** @type {Map<string, Array<{ index: number; status: string }>>} */
  const byKey = new Map()
  actions.forEach((action, index) => {
    const key = JSON.stringify([
      action.category,
      Date.parse(action.date) || action.date,
      canonicalSet(expand(action.acting_entity_refs, entityGroupMembers)),
      canonicalSet(expand(action.receiving_entity_refs, entityGroupMembers)),
      canonicalSet(action.referenced_action_ids ?? []),
      canonicalVulnIds(action.dl_vuln_ids),
      // directly listed products and expanded product groups form one set
      canonicalSet([
        ...(action.product_ids ?? []),
        ...expand(action.group_ids, productGroupMembers),
      ]),
    ])
    const entry = { index, status: action.status }
    const list = byKey.get(key)
    if (list) list.push(entry)
    else byKey.set(key, [entry])
  })

  for (const list of byKey.values()) {
    const first = list[0]
    for (const other of list.slice(1)) {
      if (other.status === first.status) continue
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/document/involvement/actions/${other.index}`,
        message: `the action contradicts the action at index ${first.index} by having a different status`,
      })
    }
  }

  return ctx
}
