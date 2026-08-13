import { recommendedTest_6_2_39_2 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_2.js'
import { getTranslationInDocumentLang } from '../../lib/shared/languageSpecificTranslation.js'

describe('recommendedTest_6_2_39_2', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_39_2({}).warnings.length).to.equal(0)
  })

  it('only runs on valid category', function () {
    const result = recommendedTest_6_2_39_2({
      document: { category: '123', license_expression: 'MIT' },
    })

    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(0)
  })

  it('info on invalid language', function () {
    const result = recommendedTest_6_2_39_2({
      document: {
        category: 'csaf_withdrawn',
        lang: '123',
        license_expression: 'MIT',
      },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(1)
  })

  it('check get ReasoningForWithdrawal in document lang', function () {
    expect(
      getTranslationInDocumentLang(
        { document: { lang: 'de' } },
        'reasoning_for_withdrawal'
      )
    ).to.eq('Begründung für die Zurückziehung')
    expect(
      getTranslationInDocumentLang(
        { document: { lang: 'es' } },
        'reasoning_for_withdrawal'
      )
    ).to.eq(undefined)
    expect(
      getTranslationInDocumentLang({ document: {} }, 'reasoning_for_withdrawal')
    ).to.eq(undefined)
  })
})
