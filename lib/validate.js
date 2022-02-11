/**
 * @param {Array<import('./shared/types').DocumentTest>} tests
 * @param {any} doc
 */
module.exports = function (tests, doc) {
  /** @type {Array<{ message?: string; instancePath: string }>} */
  const errors = []
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  /** @type {Array<{ message: string; instancePath: string }>} */
  const infos = []
  let isValid = true
  tests.forEach((test) => {
    const result = test(doc)
    isValid =
      isValid && (typeof result.isValid === 'boolean' ? result.isValid : true)
    errors.push(...(result.errors ?? []))
    warnings.push(...(result.warnings ?? []))
    infos.push(...(result.infos ?? []))
  })

  return { isValid, errors, warnings, infos }
}
