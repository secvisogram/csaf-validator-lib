import { recommendedTest_6_2_39_5 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_5.js'

describe('recommendedTest_6_2_39_5', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_39_5({})
    assert.equal(result.warnings.length, 0)
  })
})
