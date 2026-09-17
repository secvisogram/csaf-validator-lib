// Helper to generate a key by ignoring the 'action_id' field
const createSanitizedKey = (/** @type {any} */ obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (key === 'action_id') return undefined // Completely removes 'action_id' from serialization
    if (Array.isArray(value)) return [...value].sort() // Normalize array order
    return value
  })
}

/**
 * @param {unknown} doc
 */
export default function mandatoryTest_6_1_24(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  // 6.1.24 Definition in Actions
  if (preconditionFor_6_1_24_Matches(doc)) {
    doc.involvement.forEach((involvement, involvementIndex) => {
      /** @type {Set<string>} */ const uniqueObjects = new Set()
      involvement.actions.forEach((action, actionIndex) => {
        const sanitizedAction = createSanitizedKey(action)
        if (uniqueObjects.has(sanitizedAction)) {
          isValid = false
          errors.push({
            message: `The list of actions contains two items with the same content when ignoring their \`action_id\``,
            instancePath: `/involvement/${involvementIndex}/actions/${actionIndex}`,
          })
        }
        uniqueObjects.add(sanitizedAction)
      })
    })
  }

  return { errors, isValid }
}

/**
 * @param {unknown} rawDoc
 * @returns {rawDoc is {
 *    involvement: Array<{
 *      actions: Array<{
 *        action_id?: string
 *        acting_entity_refs?: Array<string>
 *        category?: string
 *        date?: string
 *        dl_vuln_ids?: Array<string>
 *        group_ids?: Array<string>
 *        product_ids?: Array<string>
 *        receiving_entity_refs?: Array<string>
 *        referenced_action_ids?: Array<string>
 *        status?: string
 *        summary?: string
 *      }>
 *    }>
 *  }}
 */
const preconditionFor_6_1_24_Matches = (rawDoc) => {
  if (typeof rawDoc !== 'object' || !rawDoc) return false
  /** @type {{ involvement?: unknown }} */
  const doc = rawDoc
  return (
    Array.isArray(doc.involvement) &&
    doc.involvement.every(
      (involvement) =>
        Array.isArray(involvement.actions) &&
        involvement.actions.every(
          (/** @type {any} */ action) =>
            (typeof action.action_id === 'string' ||
              action.action_id === undefined) &&
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
            (typeof action.status === 'string' ||
              action.status === undefined) &&
            (typeof action.summary === 'string' || action.summary === undefined)
        )
    )
  )
}
