import { readFile } from 'fs/promises'
import validate from '../validate.js'

/** @type {Map<string, Function[]>} */
const testCache = new Map()

/**
 * @param {string} testName
 * @param {string} csafVersion
 * @returns {Promise<Function[]>}
 */
async function resolveTests(testName, csafVersion) {
  const cacheKey = `${csafVersion}:${testName}`
  if (testCache.has(cacheKey)) return testCache.get(cacheKey)

  const allTests =
    csafVersion === '2.0'
      ? {
          mandatory: Object.values(await import('../mandatoryTests.js')),
          optional: Object.values(await import('../optionalTests.js')),
          recommended: [],
          informative: Object.values(await import('../informativeTests.js')),
          schema: Object.values(await import('../schemaTests.js')),
        }
      : {
          mandatory: Object.values(await import('../csaf_2_1/mandatoryTests.js')),
          optional: [],
          recommended: Object.values(await import('../csaf_2_1/recommendedTests.js')),
          informative: Object.values(await import('../csaf_2_1/informativeTests.js')),
          schema: Object.values(await import('../csaf_2_1/schemaTests.js')),
        }

  const matchingTests =
    testName === 'mandatory'
      ? allTests.mandatory
      : testName === 'optional'
      ? allTests.optional
      : testName === 'recommended'
      ? allTests.recommended
      : testName === 'informative'
      ? allTests.informative
      : testName === 'schema'
      ? allTests.schema
      : testName === 'base'
      ? [...allTests.schema, ...allTests.mandatory]
      : [
          ...allTests.mandatory,
          ...allTests.optional,
          ...allTests.recommended,
          ...allTests.informative,
          ...allTests.schema,
        ].filter((t) => t.name === testName)

  testCache.set(cacheKey, matchingTests)
  return matchingTests
}

/**
 * @param {object} params
 * @param {string} params.filePath
 * @param {string} params.testName
 * @param {string} params.csafVersion
 * @returns {Promise<{ file: string, isValid: boolean, tests: unknown[], skipped: boolean }>}
 */
export default async function ({ filePath, testName, csafVersion }) {
  const matchingTests = await resolveTests(testName, csafVersion)

  let json
  try {
    json = JSON.parse(await readFile(filePath, { encoding: 'utf-8' }))
  } catch {
    return { file: filePath, isValid: false, tests: [], skipped: true }
  }

  const result = await validate(matchingTests, json)
  return {
    file: filePath,
    isValid: result.isValid,
    tests: result.isValid ? [] : result.tests,
    skipped: false,
  }
}
