/*
Script to read all CVSS decision points from github and create a json File with all defined decision points
 */

import fs from 'node:fs'

const CVSS_DECISION_POINT_ROOT_URL =
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
 * @property {string} schemaVersion
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
  const decisionPointDirectories = await readJson(
    CVSS_DECISION_POINT_ROOT_URL,
    githubToken
  )
  /** @type {Array<string>} */
  const decisionPointFiles = []
  /** @type {Array<DecisionPointInfo>} */
  for (const directory of decisionPointDirectories) {
    /** @type {Array<GithubResponse>} */
    const decisionPoints = await readJson(directory.url, githubToken)
    for (const decisionPoint of decisionPoints) {
      if (decisionPoint.name.endsWith('.json')) {
        decisionPointFiles.push(decisionPoint.download_url)
      }
    }
  }

  const result = []
  for (const fileName of decisionPointFiles) {
    /** @type {DecisionPoint} */
    const decisionPoint = await readJson(fileName, githubToken)
    result.push({
      name: decisionPoint.name,
      namespace: decisionPoint.namespace,
      schemaVersion: decisionPoint.schemaVersion,
      version: decisionPoint.version,
      key: decisionPoint.key,
    })
  }
  return result
}

readDecisionPoints(GITHUB_TOKEN).then((points) => {
  const pointsObject = { decisionPoints: points }
  const pointsJson = 'export default ' + JSON.stringify(pointsObject)
  fs.writeFile(OUTPUT_FILE, pointsJson, (err) => {
    if (err) {
      console.log(err)
    }
  })
})
