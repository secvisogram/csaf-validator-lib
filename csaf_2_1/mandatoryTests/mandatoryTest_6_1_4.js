import { walkPath } from '../../lib/walkPaths.js'
import {
  collectGroupIdsFromProductTree,
  findMissingDefinitions,
} from './shared/docProductUtils.js'

/**
 * @typedef {{id: string, instancePath: string}} GroupId
 */

/**
 * This implements the mandatory test 6.1.4 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function mandatoryTest_6_1_4(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  const groupIds = collectGroupIdsFromProductTree(/** @type {any} */ (doc))
  const groupIdRefs = await collectGroupIds(doc)
  const missingGroupDefinitions =
    /** @type {{id: string, instancePath: string}[]} */ (
      findMissingDefinitions(groupIds, groupIdRefs)
    )
  if (missingGroupDefinitions.length > 0) {
    ctx.isValid = false
    missingGroupDefinitions.forEach(
      (
        /** @type {{id: string, instancePath: string}} */ missingGroupDefinition
      ) => {
        ctx.errors.push({
          message: 'definition of group id missing',
          instancePath: missingGroupDefinition.instancePath,
        })
      }
    )
  }

  return ctx
}

/**
 * Collects all group_id references and their instancePaths from the document.
 * @param {unknown} doc
 * @returns {Promise<GroupId[]>}
 */
async function collectGroupIds(doc) {
  const entries = /** @type {GroupId[]} */ ([])

  for (const path of [
    '/document/notes[]/group_ids[]',
    '/vulnerabilities[]/first_known_exploitation_dates[]/group_ids[]',
    '/vulnerabilities[]/flags[]/group_ids[]',
    '/vulnerabilities[]/ids[]/group_ids[]',
    '/vulnerabilities[]/involvements[]/group_ids[]',
    '/vulnerabilities[]/notes[]/group_ids[]',
    '/vulnerabilities[]/remediations[]/group_ids[]',
    '/vulnerabilities[]/threats[]/group_ids[]',
  ]) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value === 'string' && value) {
        entries.push({ id: value, instancePath })
      }
    })
  }

  return entries
}
