import { recommendedTest_6_2_39_3 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_3.js'
import { expect } from 'chai'
import assert from 'node:assert'
import { getTranslationInDocumentLang } from '../../lib/shared/languageSpecificTranslation.js'
import { recommendedTest_6_2_39_2 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_2.js'

describe('recommendedTest_6_2_39_3', function () {
  it('only runs on relevant documents', function () {
    assert.equal(recommendedTest_6_2_39_3({}).warnings.length, 0)
  })

  it('only runs on valid category', function () {
    const result = recommendedTest_6_2_39_3({
      document: { category: '123', license_expression: 'MIT' },
    })

    assert.equal(result.warnings.length, 0)
    assert.equal(result.infos.length, 0)
  })

  it('info on invalid language', function () {
    const result = recommendedTest_6_2_39_3({
      document: {
        category: 'csaf_superseded',
        lang: '123',
        license_expression: 'MIT',
      },
    })
    assert.equal(result.warnings.length, 0)
    assert.equal(result.infos.length, 1)
  })

  it('check get reasoning_for_supersession in document lang', function () {
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
