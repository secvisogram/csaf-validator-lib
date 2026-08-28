import * as informative from '../informativeTests.js'
import * as optional from '../optionalTests.js'
import * as mandatory from '../mandatoryTests.js'
import isBrowserRuntime from './shared/isBrowserRuntime.js'

/** @typedef {import('../lib/shared/types.js').DocumentTest} DocumentTest */

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
  ['optional', /** @type {TestMap} */ (new Map(Object.entries(optional)))],
  ['mandatory', /** @type {TestMap} */ (new Map(Object.entries(mandatory)))],
])

// `import.meta.glob` patterns must be static string literals, so the shared
// `../csaf/csaf_2.0/test/validator/data/` prefix can't be a variable there - it's
// duplicated as a literal below and as the `testDataDir` string used to build lookup
// keys into `testDataModules`.
const testDataDir = '../csaf/csaf_2.0/test/validator/data/'

const testCasesModules = import.meta.glob(
  '../csaf/csaf_2.0/test/validator/data/testcases.json',
  { eager: true, import: 'default' }
)
const testCases = /** @type {TestCases} */ (Object.values(testCasesModules)[0])

// Lazy (non-eager): resolves fixtures on demand instead of bundling the whole ~1MB
// OASIS fixture corpus upfront.
const testDataModules = import.meta.glob(
  '../csaf/csaf_2.0/test/validator/data/**/*.json',
  { import: 'default' }
)

const testMap = parseTestCases()

describe('oasis', function () {
  for (const [group, t] of testMap) {
    describe(group, function () {
      for (const [testId, u] of t) {
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
            if (testSpecs.length === 0) continue

            describe(type, function () {
              for (const testSpec of testSpecs) {
                it(testSpec.name, async function () {
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
                    expect(result.isValid === undefined).to.equal(
                      testSpec.valid
                    )

                    if (group === 'optional') {
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
})

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
