import assert from 'node:assert/strict'
import {
  mandatoryTest_6_1_26,
  normalize,
} from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_26.js'

describe('mandatoryTest_6_1_26', function () {
  it('only runs on relevant documents', function () {
    assert.equal(mandatoryTest_6_1_26({ document: 'mydoc' }).isValid, true)
  })
  it('check use of reserved prefix csaf_ except if the value is csaf_base', function () {
    assert.equal(
      mandatoryTest_6_1_26({
        document: {
          category: 'csaf_invalid',
        },
      }).isValid,
      false
    )
  })
  it('check all separators defined in the spec ', function () {
    const emDash = '\u2014'
    const enDash = '\u2013'
    const figureDash = '\u2012'
    const horizontalBar = '\u2015'
    const hyphen = '\u2010'
    const hyphenMinus = '\u002D'
    const nonBreakingHyphen = '\u2011'
    const lowLine = '\u005F'
    const combiningLowLine = '\u0332'
    const fullwidthLowLine = '\uFF3F'

    const result = normalize(
      `emDash${emDash}enDash${enDash}figureDash${figureDash}horizontalBar${horizontalBar}` +
        `hyphen${hyphen}hyphenMinus${hyphenMinus}nonBreakingHyphen${nonBreakingHyphen}lowLine${lowLine}` +
        `combiningLowLine${combiningLowLine}fullwidthLowLine${fullwidthLowLine}`
    )
    assert.equal(
      result,
      'emdashendashfiguredashhorizontalbarhyphenhyphenminusnonbreakinghyphenlowlinecombininglowlinefullwidthlowline'
    )
  })
})
