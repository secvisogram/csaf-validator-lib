/**
 * Finds which array property in the object contains duplicate strings.
 * @param {Record<string, any>} obj
 * @returns {string | undefined} The key containing duplicates, or undefined if none
 */
function findDuplicateKey(obj) {
  for (const key in obj) {
    const value = obj[key]

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
const createSanitizedKey = (/** @type {any} */ obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (key === 'action_id') return undefined // Completely removes 'action_id' from serialization
    if (Array.isArray(value)) return [...value].sort() // Normalize array order
    return value
  })
}

/**
 * @param {any} doc
 * @returns {{
 *   errors: Array<{ message: string; instancePath: string }>,
 *   isValid: boolean
 * }}
 */
export function mandatoryTest_6_1_24(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  // 6.1.24 Definition in Actions
  if (preconditionFor_6_1_24_Matches(doc)) {
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

/**
 * @param {any} doc
 * @returns {doc is {
 *    document: {
 *      involvement: {
 *        actions: Array<{
 *          action_id: string
 *          acting_entity_refs?: Array<string>
 *          category?: string
 *          date?: string
 *          dl_vuln_ids?: Array<string>
 *          group_ids?: Array<string>
 *          product_ids?: Array<string>
 *          receiving_entity_refs?: Array<string>
 *          referenced_action_ids?: Array<string>
 *          status?: string
 *          summary?: string
 *        }>
 *      }
 *    }
 *  }}
 */
const preconditionFor_6_1_24_Matches = (doc) => {
  return (
    Array.isArray(doc?.document?.involvement?.actions) &&
    doc.document.involvement.actions.every(
      (/** @type {any} */ action) =>
        typeof action.action_id === 'string' &&
        ((Array.isArray(action.acting_entity_refs) &&
          action.acting_entity_refs.every(
            (/** @type {any} */ ref) => typeof ref === 'string'
          )) ||
          action.acting_entity_refs === undefined) &&
        (typeof action.category === 'string' ||
          action.category === undefined) &&
        (typeof action.date === 'string' || action.date === undefined) &&
        ((Array.isArray(action.dl_vuln_ids) &&
          action.dl_vuln_ids.every(
            (/** @type {any} */ id) => typeof id === 'string'
          )) ||
          action.dl_vuln_ids === undefined) &&
        ((Array.isArray(action.group_ids) &&
          action.group_ids.every(
            (/** @type {any} */ id) => typeof id === 'string'
          )) ||
          action.group_ids === undefined) &&
        ((Array.isArray(action.product_ids) &&
          action.product_ids.every(
            (/** @type {any} */ id) => typeof id === 'string'
          )) ||
          action.product_ids === undefined) &&
        ((Array.isArray(action.receiving_entity_refs) &&
          action.receiving_entity_refs.every(
            (/** @type {any} */ ref) => typeof ref === 'string'
          )) ||
          action.receiving_entity_refs === undefined) &&
        ((Array.isArray(action.referenced_action_ids) &&
          action.referenced_action_ids.every(
            (/** @type {any} */ ref) => typeof ref === 'string'
          )) ||
          action.referenced_action_ids === undefined) &&
        (typeof action.status === 'string' || action.status === undefined) &&
        (typeof action.summary === 'string' || action.summary === undefined)
    )
  )
}
