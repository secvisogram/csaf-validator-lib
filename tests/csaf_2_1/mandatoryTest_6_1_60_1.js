import assert from 'node:assert/strict'
import csafAjv from '../../csaf_2_1/csafAjv.js'

describe('mandatoryTest_6_1_60_1', function () {
  it('returns a valid empty result when the extension-content schema is unavailable', async function () {
    const originalGetSchema = csafAjv.getSchema.bind(csafAjv)
    csafAjv.getSchema = () => undefined

    let result
    try {
      const freshModule = await import(
        '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_60_1.js?guard-test=' +
          Date.now()
      )
      result = await freshModule.mandatoryTest_6_1_60_1({
        x_extensions: { foo: 'bar' },
      })
    } finally {
      csafAjv.getSchema = originalGetSchema
    }

    assert.deepEqual(result, { errors: [], isValid: true })
  })
})
