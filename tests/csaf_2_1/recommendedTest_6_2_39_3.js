import { recommendedTest_6_2_39_3 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_3.js'
import { expect } from 'chai'
import assert from 'node:assert'
import { getTranslationInDocumentLang } from '../../lib/shared/languageSpecificTranslation.js'

describe('recommendedTest_6_2_39_3', function () {
  it('only runs on relevant documents', function () {
    assert.equal(recommendedTest_6_2_39_3({}).warnings.length, 0)
  })

  it('only runs on valid language', function () {
    assert.equal(
      recommendedTest_6_2_39_3({
        document: { lang: '123', license_expression: 'MIT' },
      }).warnings.length,
      0
    )
  })

  it('check get ReasoningForWithdrawal in document lang', function () {
    expect(
      getTranslationInDocumentLang(
        { document: { lang: 'de' } },
        'reasoning_for_supersession'
      )
    ).to.eq('Begründung für die Ersetzung')
    expect(
      getTranslationInDocumentLang(
        { document: { lang: 'jp' } },
        'reasoning_for_supersession'
      )
    ).to.eq(undefined)
    expect(
      getTranslationInDocumentLang(
        { document: {} },
        'reasoning_for_supersession'
      )
    ).to.eq(undefined)
  })
})
