/**
 * Script to read all SSVC decision points from github and create a json File with all defined decision points
 */

import fs from 'node:fs'
import { registeredSsvcNamespaces } from '../csaf_2_1/shared/ssvcNamespaces.js'

const SSVC_DECISION_POINTS_PATH = 'data/json/decision_points'
const SSVC_TREE_URL = `https://api.github.com/repos/CERTCC/SSVC/git/trees/main?recursive=1`
const SSVC_RAW_BASE_URL = `https://raw.githubusercontent.com/CERTCC/SSVC/main`
const OUTPUT_FILE = '../lib/ssvc/ssvc_decision_points.js'

// Maps namespace names (from ssvcNamespaces.js) to their folder names in the SSVC repo.
const NAMESPACE_TO_FOLDER = /** @type {Record<string,string>} */ ({
  nist: 'nist_800_30',
})

// Filter out reserved namespaces
const CURRENT_DECISION_POINTS = registeredSsvcNamespaces.map(
  (ns) => NAMESPACE_TO_FOLDER[ns] ?? ns
)

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

readDecisionPoints().then((points) => {
  points.sort((a, b) => {
    const nsCompare = (a.namespace ?? '').localeCompare(b.namespace ?? '')
    if (nsCompare !== 0) return nsCompare
    const keyCompare = (a.key ?? '').localeCompare(b.key ?? '')
    if (keyCompare !== 0) return keyCompare
    return (a.version ?? '').localeCompare(b.version ?? '')
  })
  console.log(`Loaded ${points.length} decision points.`)
  const pointsObject = { decisionPoints: points }
  const pointsJson = 'export default ' + JSON.stringify(pointsObject, null, 2)
  fs.writeFile(OUTPUT_FILE, pointsJson, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`Written to ${OUTPUT_FILE}`)
    }
  })
})
