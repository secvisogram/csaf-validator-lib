import assert from 'node:assert'
import { recommendedTest_6_2_54_3 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_54_3', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_54_3({})
    assert.equal(result.warnings.length, 0)
  })

  it('does not report a warning when the extension has no "critical" property', async function () {
    const result = await recommendedTest_6_2_54_3({
      x_extensions: [{ category: 'essential' }],
    })
    assert.equal(result.warnings.length, 0)
  })
})
