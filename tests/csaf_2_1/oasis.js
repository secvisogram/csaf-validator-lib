import * as informative from '../../csaf_2_1/informativeTests.js'
import * as recommended from '../../csaf_2_1/recommendedTests.js'
import * as mandatory from '../../csaf_2_1/mandatoryTests.js'
import isBrowserRuntime from '../shared/isBrowserRuntime.js'

/**
 * This is a list that includes all test numbers that are not yet implemented.
 * Once all tests are implemented for CSAF 2.1 this should be deleted.
 */
const excluded = [
  '6.1.27.13',
  '6.1.48',
  '6.1.50',
  '6.1.53',
  '6.1.54',
  '6.1.55',
  '6.1.59',
  '6.1.60.2',
  '6.1.60.3',
  '6.2.19',
  '6.2.20',
  '6.2.24',
  '6.2.26',
  '6.2.31',
  '6.2.34',
  '6.2.35',
  '6.2.37',
  '6.2.39.1',
  '6.2.44',
  '6.2.45',
  '6.2.46',
  '6.2.50.1',
  '6.2.50.2',
  '6.2.50.3',
  '6.2.51',
  '6.2.54.1',
  '6.2.54.2',
  '6.2.54.4',
  '6.3.12',
  '6.3.13',
  '6.3.15',
  '6.3.16',
  '6.3.17',
  '6.3.19.1',
  '6.3.19.2',
  '6.3.19.3',
  '6.3.19.4',
  '6.3.19.5',
  '6.3.21.2',
  '6.3.21.7',
]

/**
 * This is a list that includes all implemented tests that are currently skipped due to known issues.
 * Once the issues are resolved, these should be removed from this list and the tests should be re-enabled.
 */
const skippedTests = new Set([
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-03-01.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-03-02.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-14-32.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-21-17.json',
  'mandatory/oasis_csaf_tc-csaf_2_1-2024-6-1-27-08-02.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-13.json',
  'recommended/oasis_csaf_tc-csaf_2_1-2024-6-2-38-02.json',
])

/** @typedef {import('../../lib/shared/types.js').DocumentTest} DocumentTest */

/** @typedef {Map<string, DocumentTest>} TestMap */

/**
 * @typedef {object} TestCases
 * @property {TestCase[]} tests
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

// `import.meta.glob` patterns must be static string literals, so the shared
// `../../csaf/csaf_2.1/test/validator/data/` prefix can't be a variable there - it's
// duplicated as a literal below and as the `testDataDir` string used to build lookup
// keys into `testDataModules`.
const testDataDir = '../../csaf/csaf_2.1/test/validator/data/'

const testCasesModules = import.meta.glob(
  '../../csaf/csaf_2.1/test/validator/data/testcases.json',
  { eager: true, import: 'default' }
)
const testCases = /** @type {TestCases} */ (Object.values(testCasesModules)[0])

// Lazy (non-eager): resolves fixtures on demand instead of bundling the whole ~4MB
// OASIS fixture corpus upfront.
const testDataModules = import.meta.glob(
  '../../csaf/csaf_2.1/test/validator/data/**/*.json',
  { import: 'default' }
)

const testMap = parseTestCases()

for (const [group, t] of testMap) {
  describe(group, function () {
    for (const [testId, u] of t) {
      if (excluded.includes(testId)) continue

      // informativeTest_6_3_8 (the only OASIS informative test reached here
      // without a hunspell mock override) shells out to the real `hunspell`
      // CLI - not available in the Vitest browser project.
      // informativeTest_6_3_6/6_3_7 perform real HTTP HEAD requests (see
      // lib/informativeTests/shared/testURL.js); a real browser sandbox can't
      // make arbitrary cross-origin requests without CORS. Therefore we skip
      // the tests here.
      const isSkipped =
        isBrowserRuntime &&
        group === 'informative' &&
        ['6.3.6', '6.3.7', '6.3.8'].includes(testId)

      if (isSkipped) continue

      describe(testId, function () {
        for (const [type, testSpecs] of u) {
          const filteredTestSpecs = testSpecs.filter(
            (testSpec) => !skippedTests.has(testSpec.name)
          )
          if (filteredTestSpecs.length === 0) continue

          describe(type, function () {
            for (const testSpec of filteredTestSpecs) {
              it(testSpec.name, async () => {
                const test = tests
                  .get(group)
                  ?.get(`${group}Test_${testId.replace(/\./g, '_')}`)

                if (!test)
                  throw new Error(
                    `no matching test found for group=${group}, ${testId}`
                  )

                const doc = await testDataModules[
                  `${testDataDir}${testSpec.name}`
                ]()

                const result = await test(doc)

                if (group === 'mandatory') {
                  expect(result.isValid).to.equal(testSpec.valid)
                  expect(
                    Boolean(result.errors?.length),
                    type === 'failures'
                      ? 'should have errors'
                      : `should not have errors, but had ${result.errors?.length}`
                  ).to.equal(type === 'failures')
                } else {
                  expect(result.isValid === undefined).to.equal(testSpec.valid)

                  if (group === 'recommended') {
                    expect(
                      Boolean(result.warnings?.length),
                      type === 'failures'
                        ? 'should have warnings'
                        : `should not have warnings, but had ${result.warnings?.length}`
                    ).to.equal(type === 'failures')
                  } else if (group === 'informative') {
                    expect(
                      Boolean(result.infos?.length),
                      type === 'failures'
                        ? 'should have infos'
                        : `should not have infos, but had ${result.infos?.length}`
                    ).to.equal(type === 'failures')
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
