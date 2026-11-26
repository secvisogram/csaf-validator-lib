import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const actionSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    action_id: { type: 'string' },
  },
  optionalProperties: {
    acting_entity_refs: { elements: { type: 'string' } },
    category: { type: 'string' },
    date: { type: 'string' },
    dl_vuln_ids: { elements: { type: 'string' } },
    group_ids: { elements: { type: 'string' } },
    product_ids: { elements: { type: 'string' } },
    receiving_entity_refs: { elements: { type: 'string' } },
    referenced_action_ids: { elements: { type: 'string' } },
    status: { type: 'string' },
    summary: { type: 'string' },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        involvement: {
          additionalProperties: true,
          optionalProperties: {
            actions: {
              elements: actionSchema,
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof actionSchema>} Action
 */

/**
 * Finds which array property in the object contains duplicate strings.
 * @param {Action} obj
 * @returns {string | undefined} The key containing duplicates, or undefined if none
 */
function findDuplicateKey(obj) {
  for (const key in obj) {
    const value = /** @type {Record<string, unknown>} */ (obj)[key]

    // Skip non-array properties
    if (!Array.isArray(value)) continue

    // Fast O(N) check using a Set
    if (new Set(value).size !== value.length) {
      return key // Immediately exit and return the exact key name
    }
  }
  return undefined
}

// Helper to generate a key by ignoring the 'action_id' field
const createSanitizedKey = (/** @type {Action} */ obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (key === 'action_id') return undefined // Completely removes 'action_id' from serialization
    if (Array.isArray(value)) return [...value].sort() // Normalize array order
    return value
  })
}

/**
 * This implements the mandatory test 6.1.24 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_24(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  // 6.1.24 Definition in Actions
  if (validate(doc) && Array.isArray(doc.document?.involvement?.actions)) {
    /** @type {Set<string>} */ const uniqueObjects = new Set()
    doc.document.involvement.actions.forEach((action, actionIndex) => {
      // Check for duplicates in sets
      const duplicateKey = findDuplicateKey(action)
      if (duplicateKey) {
        isValid = false
        errors.push({
          message: `The list of actions contains an item which has duplicate entries in \`${duplicateKey}\``,
          instancePath: `/document/involvement/actions/${actionIndex}`,
        })
      }
      // Check for duplicate actions
      const sanitizedAction = createSanitizedKey(action)
      if (uniqueObjects.has(sanitizedAction)) {
        isValid = false
        errors.push({
          message: `The list of actions contains two items with the same content when ignoring their \`action_id\``,
          instancePath: `/document/involvement/actions/${actionIndex}`,
        })
      }
      uniqueObjects.add(sanitizedAction)
    })
  }

  return { errors, isValid }
}
