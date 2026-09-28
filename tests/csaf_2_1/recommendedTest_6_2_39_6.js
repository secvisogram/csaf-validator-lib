import { recommendedTest_6_2_39_6 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_6.js'

describe('recommendedTest_6_2_39_6', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_39_6({}).warnings.length).to.equal(0)
  })

  it('only runs on category csaf_vulnerability_report', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_base', lang: 'de' },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(0)
  })

  it('returns early when no document language is specified', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report' },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(0)
  })

  it('info on invalid language', function () {
    const result = recommendedTest_6_2_39_6({
      document: {
        category: 'csaf_vulnerability_report',
        lang: '123',
      },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(1)
  })
})
