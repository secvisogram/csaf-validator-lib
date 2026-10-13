import { recommendedTest_6_2_39_8 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_8.js'

describe('recommendedTest_6_2_39_8', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_39_8({}).warnings.length).to.equal(0)
  })

  it('only runs on relevant category', function () {
    const result = recommendedTest_6_2_39_8({
      document: { category: 'csaf_security_advisory' },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
