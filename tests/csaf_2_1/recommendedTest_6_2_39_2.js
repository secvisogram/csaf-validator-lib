import {
  getTranslationInDocumentLang,
  recommendedTest_6_2_39_2,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_2.js'
import { expect } from 'chai'
import assert from 'node:assert'

describe('recommendedTest_6_2_39_2', function () {
  it('only runs on relevant documents', function () {
    assert.equal(recommendedTest_6_2_39_2({}).warnings.length, 0)
  })

  it('only runs on valid language', function () {
    assert.equal(
      recommendedTest_6_2_39_2({
        document: { lang: '123', license_expression: 'MIT' },
      }).warnings.length,
      0
    )
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
