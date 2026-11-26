/**
 * @typedef {object} InvolvementAction
 * @property {string[]} [acting_entity_refs]
 * @property {string[]} [receiving_entity_refs]
 */

/**
 * Collects all IDs that are referenced by the actions of
 * `$.document.involvement.actions`. The `acting_entity_refs` and
 * `receiving_entity_refs` may contain entity IDs as well as entity group IDs.
 *
 * @param {InvolvementAction[]} actions
 * @returns {Set<string>}
 */
export function collectActionEntityRefs(actions) {
  /** @type {Set<string>} */
  const refs = new Set()

  for (const action of actions) {
    for (const id of action.acting_entity_refs ?? []) refs.add(id)
    for (const id of action.receiving_entity_refs ?? []) refs.add(id)
  }

  return refs
}
