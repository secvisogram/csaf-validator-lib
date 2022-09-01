import * as mandatory from './mandatoryTests.js'
import * as optional from './optionalTests.js'
import * as informative from './informativeTests.js'
import * as schema from './schemaTests.js'

const validTests = /** @type {import('./shared/types').DocumentTest[]} */ (
  Object.values(mandatory)
)
  .concat(Object.values(optional))
  .concat(Object.values(informative))
  .concat(Object.values(schema))

/**
 * @param {Array<import('./shared/types').DocumentTest>} tests
 * @param {any} doc
 * @param {object} [options]
 * @param {boolean} [options.strict]
 */
export default async function (tests, doc, { strict = true } = {}) {
  let isValid = true
  const testResults =
    /** @type {({ name: string } & import('./shared/types').Result)[]} */ ([])

  for (const test of tests) {
    if (strict && !validTests.includes(test)) {
      throw new Error('Execution of test functions not defined in the library is prohibited. See https://github.com/secvisogram/csaf-validator-lib#strict-mode for more details.')
    }
    const result = await test(doc)
    const testIsValid =
      typeof result.isValid === 'boolean' ? result.isValid : true
    testResults.push({
      isValid: testIsValid,
      errors: result.errors ?? [],
      warnings: result.warnings ?? [],
      infos: result.infos ?? [],
      name: test.name,
    })
    isValid = isValid && testIsValid
  }

  return { tests: testResults, isValid }
}
