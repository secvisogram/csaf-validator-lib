/**
 * @param {Array<(doc: any) => { isValid?: boolean; warnings?: Array<{ message: string; instancePath: string }>; errors?: Array<{ message: string; instancePath: string }> }>} tests
 * @param {any} doc
 */
module.exports = function (tests, doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  let isValid = true
  tests.forEach((test) => {
    const result = test(doc)
    isValid =
      isValid && (typeof result.isValid === 'boolean' ? result.isValid : true)
    errors.push(...(result.errors ?? []))
    warnings.push(...(result.warnings ?? []))
  })

  return { isValid, errors, warnings }
}
