/*
Script to read all CVSS decision points from github and create a json File with all defined decision points
 */

import fs from 'node:fs'

const CVSS_DECISION_POINT_URL =
  'https://api.github.com/repos/CERTCC/SSVC/contents/data/json/decision_points?ref=main'
const OUTPUT_FILE = '../lib/cvss/decision_points.js'

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
  const data = await readJson(CVSS_DECISION_POINT_URL, githubToken)
  /** @type {Array<DecisionPointInfo>} */
  const result = []
  for (const item of data) {
    if (item.name.endsWith('.json')) {
      /** @type {DecisionPoint} */
      const decisionPoint = await readJson(item.download_url, githubToken)
      result.push({
        name: decisionPoint.name,
        namespace: decisionPoint.namespace,
        version: decisionPoint.version,
        key: decisionPoint.key,
      })
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
