import { readFile } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import * as informative from '../../csaf_2_1/informativeTests.js'
import * as recommended from '../../csaf_2_1/recommendedTests.js'
import * as mandatory from '../../csaf_2_1/mandatoryTests.js'

/**
 * This is a list that includes all test numbers that are not yet implemented.
 * Once all tests are implemented for CSAF 2.1 this should be deleted.
 */
const excluded = [
  '6.1.26',
  '6.1.27.13',
  '6.1.48',
  '6.1.50',
  '6.1.53',
  '6.1.54',
  '6.1.55',
  '6.1.56',
  '6.1.59',
  '6.1.60.1',
  '6.1.60.2',
  '6.1.60.3',
  '6.2.19',
  '6.2.20',
  '6.2.24',
  '6.2.26',
  '6.2.31',
  '6.2.32',
  '6.2.33',
  '6.2.34',
  '6.2.35',
  '6.2.36',
  '6.2.37',
  '6.2.39.1',
  '6.2.39.5',
  '6.2.42',
  '6.2.44',
  '6.2.45',
  '6.2.46',
  '6.2.49',
  '6.2.50.1',
  '6.2.50.2',
  '6.2.50.3',
  '6.2.51',
  '6.2.52',
  '6.2.53',
  '6.2.54.1',
  '6.2.54.2',
  '6.2.54.4',
  '6.3.12',
  '6.3.13',
  '6.3.14',
  '6.3.15',
  '6.3.16',
  '6.3.17',
  '6.3.19.1',
  '6.3.19.2',
  '6.3.19.3',
  '6.3.19.4',
  '6.3.19.5',
  '6.3.20',
  '6.3.21.2',
  '6.3.21.3',
  '6.3.21.4',
  '6.3.21.5',
  '6.3.21.6',
  '6.3.21.7',
  '6.3.21.8',
  '6.3.21.9',
  '6.3.22',
]

/**
 * This is a list that includes all implemented tests that are currently skipped due to known issues.
 * Once the issues are resolved, these should be removed from this list and the tests should be re-enabled.
 */
const skippedTests = new Set([
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-03-01.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-03-02.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-21-17.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-27-08-02.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-11.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-12.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-13.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-02.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-01.json',
])

/** @typedef {import('../../lib/shared/types.js').DocumentTest} DocumentTest */
/** @typedef {import('../../lib/shared/types.js').TestResult} TestResult */

/** @typedef {Map<string, DocumentTest>} TestMap */

/**
 * @typedef {object} TestCases
 * @property {TestCase[]} tests
 */

/**
 * @typedef {object} CsafTestResult
 * @property {string} $schema
 * @property {boolean} overall_valid
 * @property {PrimaryResult} primary_result
 * @property {string} resultschema_version
 * @property {SecondaryResult[]} secondary_results
 */

/**
 * @typedef {object} PrimaryResult
 * @property {string} id
 * @property {boolean} passed
 */

/**
 * @typedef {object} SecondaryResult
 * @property {string} id
 * @property {boolean} passed
 * @property {ResultError[]} [errors]
 */

/**
 * @typedef {object} ResultError
 * @property {string} instance_path
 * @property {string} message
 */

/**
 * @typedef {object} TestCase
 * @property {string} id
 * @property {string} group
 * @property {TestSpec[]} [failures]
 * @property {TestSpec[]} [valid]
 */

/**
 * @typedef {object} TestSpec
 * @property {string} name
 * @property {string} result
 * @property {boolean} valid
 */

const tests = new Map([
  [
    'informative',
    /** @type {TestMap} */ (new Map(Object.entries(informative))),
  ],
  [
    'recommended',
    /** @type {TestMap} */ (new Map(Object.entries(recommended))),
  ],
  ['mandatory', /** @type {TestMap} */ (new Map(Object.entries(mandatory)))],
])

const testDataBaseUrl = new URL(
  '../../csaf/csaf_2.1/test/validator/data/',
  import.meta.url
)

const testCases = /** @type {TestCases} */ (
  JSON.parse(
    await readFile(new URL('testcases.json', testDataBaseUrl), 'utf-8')
  )
)

const testMap = parseTestCases()

/**
 *
 * @param {SecondaryResult[]} secondaryResults
 * @param {string} group
 * @param doc {any} CSAF document to check
 * @return {Promise<Map<string, TestResult>>}
 */
async function executeSecondLevelTests(secondaryResults, group, doc) {
  let testId2secondaryExecutionResult = new Map()
  if (secondaryResults) {
    const secondaryResultIds = secondaryResults.map((result) => result.id)
    for (const secondaryResultId of secondaryResultIds) {
      const secondaryTest = tests
        .get(group)
        ?.get(`${group}Test_${secondaryResultId.replace(/\./g, '_')}`)
      if (secondaryTest) {
        const resultSecondaryTestResult = await secondaryTest(doc)
        testId2secondaryExecutionResult.set(
          secondaryResultId,
          resultSecondaryTestResult
        )
      } else {
        assert.fail(`Secondary test not implemented {${secondaryResultId}}`)
      }
    }
  }
  return testId2secondaryExecutionResult
}
/**
 * Validate the defined test result against the execution results
 * @param {CsafTestResult} csafTestResult
 * @param {TestResult} primaryExecutionResult
 * @param {Map<string, TestResult>} testId2secondaryExecutionResult
 */

function validateTestResults(
  csafTestResult,
  primaryExecutionResult,
  testId2secondaryExecutionResult
) {
  assert.equal(
    primaryExecutionResult.isValid,
    csafTestResult.primary_result.passed
  )
  if (csafTestResult.secondary_results) {
    for (const secondaryResult of csafTestResult.secondary_results) {
      const executionResult = testId2secondaryExecutionResult.get(
        secondaryResult.id
      )
      if (executionResult) {
        assert.equal(executionResult.isValid, secondaryResult.passed)
      } else {
        assert.fail('No executionResult found')
      }
    }
  }
}

for (const [group, t] of testMap) {
  describe(group, function () {
    for (const [testId, u] of t) {
      describe(testId, function () {
        for (const [type, testSpecs] of u) {
          describe(type, function () {
            for (const testSpec of testSpecs) {
              if (skippedTests.has(testSpec.name)) {
                continue
              }
              if (excluded.includes(testId)) {
                continue
              }

              it(testSpec.name, async () => {
                const test = tests
                  .get(group)
                  ?.get(`${group}Test_${testId.replace(/\./g, '_')}`)

                assert(test, 'test does not exist')

                const doc = JSON.parse(
                  readFileSync(new URL(testSpec.name, testDataBaseUrl), 'utf-8')
                )

                /** @type {CsafTestResult | null} */
                let csafTestResult = null
                if (testSpec.result) {
                  csafTestResult = JSON.parse(
                    readFileSync(
                      new URL(testSpec.result, testDataBaseUrl),
                      'utf-8'
                    )
                  )
                }

                /** @type {TestResult} */
                let primaryExecutionResult = await test(doc)
                if (csafTestResult) {
                  let testId2secondaryExecutionResult =
                    await executeSecondLevelTests(
                      csafTestResult.secondary_results,
                      group,
                      doc
                    )
                  validateTestResults(
                    csafTestResult,
                    primaryExecutionResult,
                    testId2secondaryExecutionResult
                  )
                } else if (group === 'mandatory') {
                  assert.equal(primaryExecutionResult.isValid, testSpec.valid)
                  assert.equal(
                    Boolean(primaryExecutionResult.errors?.length),
                    type === 'failures',
                    type === 'failures'
                      ? 'should have errors'
                      : `should not have errors, but had ${primaryExecutionResult.errors?.length}`
                  )
                } else {
                  assert.equal(
                    primaryExecutionResult.isValid === undefined,
                    testSpec.valid
                  )

                  if (group === 'recommended') {
                    assert.equal(
                      Boolean(primaryExecutionResult.warnings?.length),
                      type === 'failures',
                      type === 'failures'
                        ? 'should have warnings'
                        : `should not have warnings, but had ${primaryExecutionResult.warnings?.length}`
                    )
                  } else if (group === 'informative') {
                    assert.equal(
                      Boolean(primaryExecutionResult.infos?.length),
                      type === 'failures',
                      type === 'failures'
                        ? 'should have infos'
                        : `should not have infos, but had ${primaryExecutionResult.infos?.length}`
                    )
                  }
                }
              })
            }
          })
        }
      })
    }
  })
}

function parseTestCases() {
  /** @type {Map<string, Map<string, Map<'valid' | 'failures', TestSpec[]>>>} */
  const testData = new Map()
  for (const test of testCases.tests) {
    const valids = testData.get(test.group)?.get(test.id)?.get('valid') ?? []
    const failures =
      testData.get(test.group)?.get(test.id)?.get('failures') ?? []

    for (const valid of test.valid ?? []) {
      valids.push(valid)
    }
    for (const failure of test.failures ?? []) {
      failures.push(failure)
    }

    testData.set(
      test.group,
      new Map(testData.get(test.group)).set(
        test.id,
        new Map(testData.get(test.group)?.get(test.id))
          .set('valid', valids)
          .set('failures', failures)
      )
    )
  }

  return testData
}
