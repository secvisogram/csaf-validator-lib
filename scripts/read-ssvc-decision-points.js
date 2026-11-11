/**
 * Script to read all SSVC decision points from github and create a json File with all defined decision points.
 *
 * Reads the current `main` branch of CERTCC/SSVC, so the output may change
 * when upstream changes. Can be run from any directory:
 *
 *   npm run update-ssvc-decision-points
 *   node scripts/read-ssvc-decision-points.js
 */

import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import prettier from 'prettier'
import {
  noProductionUseSsvcNamespaces,
  registeredSsvcNamespaces,
} from '../csaf_2_1/shared/ssvcNamespaces.js'

const SSVC_DECISION_POINTS_PATH = 'data/json/decision_points'
const SSVC_TREE_URL = `https://api.github.com/repos/CERTCC/SSVC/git/trees/main?recursive=1`
const SSVC_RAW_BASE_URL = `https://raw.githubusercontent.com/CERTCC/SSVC/main`
const OUTPUT_FILE = fileURLToPath(
  new URL('../lib/ssvc/ssvc_decision_points.js', import.meta.url)
)

// Maps namespace names (from ssvcNamespaces.js) to their folder names in the SSVC repo.
const NAMESPACE_TO_FOLDER = /** @type {Record<string,string>} */ ({
  nist: 'nist_800_30',
})

// Filter out reserved namespaces
const CURRENT_DECISION_POINTS = registeredSsvcNamespaces
  .filter((ns) => !noProductionUseSsvcNamespaces.includes(ns))
  .map((ns) => NAMESPACE_TO_FOLDER[ns] ?? ns)

/**
 * @typedef {object} DecisionPoint
 * @property {string} name
 * @property {string} definition
 * @property {string} namespace
 * @property {string} version
 * @property {string} schemaVersion
 * @property {string} key
 * @property {Array<object>} values
 */

/**
 * Read JSON from a URL
 * @param {string | URL | Request} dataUrl
 */
async function readJson(dataUrl) {
  const response = await fetch(dataUrl)
  if (!response.ok) {
    throw new Error(`Response status: ${response.status} for ${dataUrl}`)
  }
  return response.json()
}

/**
 * Read decision points from github using the Git Trees API (single API call)
 * and download each file via raw.githubusercontent.com (no token required).
 */
async function readDecisionPoints() {
  const tree = await readJson(SSVC_TREE_URL)
  const jsonFiles = tree.tree.filter(
    (/** @type {{path: string, type: string}} */ entry) =>
      entry.type === 'blob' &&
      entry.path.startsWith(SSVC_DECISION_POINTS_PATH + '/') &&
      entry.path.endsWith('.json') &&
      CURRENT_DECISION_POINTS.some((ns) =>
        entry.path.startsWith(`${SSVC_DECISION_POINTS_PATH}/${ns}/`)
      )
  )

  const result = []
  for (const file of jsonFiles) {
    /** @type {DecisionPoint} */
    const decisionPoint = await readJson(`${SSVC_RAW_BASE_URL}/${file.path}`)
    result.push({
      name: decisionPoint.name,
      namespace: decisionPoint.namespace,
      version: decisionPoint.version,
      key: decisionPoint.key,
      values: decisionPoint.values,
    })
  }

  return result
}

const points = await readDecisionPoints()
points.sort((a, b) => {
  const nsCompare = (a.namespace ?? '').localeCompare(b.namespace ?? '')
  if (nsCompare !== 0) return nsCompare
  const keyCompare = (a.key ?? '').localeCompare(b.key ?? '')
  if (keyCompare !== 0) return keyCompare
  return (a.version ?? '').localeCompare(b.version ?? '')
})
console.log(`Loaded ${points.length} decision points.`)
const pointsJson =
  'export default ' + JSON.stringify({ decisionPoints: points })
await writeFile(
  OUTPUT_FILE,
  await prettier.format(pointsJson, {
    ...(await prettier.resolveConfig(OUTPUT_FILE)),
    filepath: OUTPUT_FILE,
  })
)
console.log(`Written to ${OUTPUT_FILE}`)
