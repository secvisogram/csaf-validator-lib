import { readFile } from 'fs/promises'
import * as informative from '../../csaf_2_1/informativeTests.js'
import * as optional from '../../csaf_2_1/optionalTests.js'
import * as mandatory from '../../csaf_2_1/mandatoryTests.js'
import { readFileSync } from 'fs'
import test from 'node:test'
import assert from 'node:assert/strict'

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
  ['optional', /** @type {TestMap} */ (new Map(Object.entries(optional)))],
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

for (const [group, t] of testMap) {
  test.describe(group, function () {
    for (const [testId, u] of t) {
      test.describe(testId, function () {
        for (const [type, testSpecs] of u) {
          test.describe(type, function () {
            for (const testSpec of testSpecs) {
              test(testSpec.name, async (t) => {
                const test = tests
                  .get(group)
                  ?.get(`${group}Test_${testId.replace(/\./g, '_')}`)

                if (!test) {
                  t.todo()
                  return
                }

                const doc = JSON.parse(
                  readFileSync(new URL(testSpec.name, testDataBaseUrl), 'utf-8')
                )

                const result = await test(doc)

                if (group === 'mandatory') {
                  assert.equal(result.isValid, testSpec.valid)
                  assert.equal(
                    Boolean(result.errors?.length),
                    type === 'failures',
                    type === 'failures'
                      ? 'should have errors'
                      : `should not have errors, but had ${result.errors?.length}`
                  )
                } else {
                  assert.equal(result.isValid === undefined, testSpec.valid)

                  if (group === 'optional') {
                    assert.equal(
                      Boolean(result.warnings?.length),
                      type === 'failures',
                      type === 'failures'
                        ? 'should have warnings'
                        : `should not have warnings, but had ${result.warnings?.length}`
                    )
                  } else if (group === 'informative') {
                    assert.equal(
                      Boolean(result.infos?.length),
                      type === 'failures',
                      type === 'failures'
                        ? 'should have infos'
                        : `should not have infos, but had ${result.infos?.length}`
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
