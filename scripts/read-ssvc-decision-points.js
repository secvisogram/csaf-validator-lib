/*
Script to read all SSVC decision points from github and create a json File with all defined decision points
 */

import fs from 'node:fs'

const SSVC_DECISION_POINT_URL =
  'https://api.github.com/repos/CERTCC/SSVC/contents/data/json/decision_points?ref=main'
const OUTPUT_FILE = '../lib/ssvc/ssvc_decision_points.js'

// adapt this list if the list of registered namespaces gets extended
const CURRENT_DECISION_POINTS = ['ssvc', 'cvss']

const GITHUB_TOKEN = ''

/**
 * @typedef {object} GithubResponse
 * @property {string} name
 * @property {string} path
 * @property {string} sha
 * @property {number} size
 * @property {string} url
 * @property {string} html_url
 * @property {string} git_url
 * @property {string} download_url
 * @property {string} type
 */

/**
 * @typedef {object} DecisionPoint
 * @property {string} name
 * @property {string} description
 * @property {string} namespace
 * @property {string} version
 * @property {string} schemaVersion
 * @property {string} key
 * @property {Array<object>} values
 */

/**
 * @typedef {object} DecisionPointInfo
 * @property {string} name
 * @property {string} namespace
 * @property {string} version
 * @property {string} key
 */

/**
 * Read Json from given URL
 * @param {string | URL | Request} dataUrl
 * @param {string} githubToken
 */
async function readJson(dataUrl, githubToken) {
  /** @type {any} */
  const headers = { Accept: 'application/vnd.github.v3+json' }
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${githubToken}`
  }
  const response = await fetch(dataUrl, { headers })
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

/**
 * Read decision points from github and write them to a JSON file
 * @param {string} githubToken
 */
async function readDecisionPoints(githubToken) {
  /** @type {Array<GithubResponse>} */
  const decisionPointNamespaces = await readJson(
    SSVC_DECISION_POINT_URL,
    githubToken
  )
  const result = []
  for (const currentNamespace of decisionPointNamespaces) {
    if (CURRENT_DECISION_POINTS.includes(currentNamespace.name)) {
      const data = await readJson(currentNamespace.url, githubToken)
      /** @type {Array<DecisionPointInfo>} */
      for (const item of data) {
        if (item.name.endsWith('.json')) {
          /** @type {DecisionPoint} */
          const decisionPoint = await readJson(item.download_url, githubToken)
          result.push({
            name: decisionPoint.name,
            namespace: decisionPoint.namespace,
            version: decisionPoint.version,
            key: decisionPoint.key,
            values: decisionPoint.values,
          })
        }
      }
    }
  }

  return result
}

readDecisionPoints(GITHUB_TOKEN).then((points) => {
  console.log(points)
  const pointsObject = { decisionPoints: points }
  const pointsJson = 'export default ' + JSON.stringify(pointsObject)
  fs.writeFile(OUTPUT_FILE, pointsJson, (err) => {
    if (err) {
      console.log(err)
    }
  })
})
