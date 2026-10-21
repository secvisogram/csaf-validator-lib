import {
  normalize,
  recommendedTest_6_2_17,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_17.js'

describe('recommendedTest_6_2_17', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_17({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('skip when vulnerability text is undefined', function () {
    const result = recommendedTest_6_2_17({
      vulnerabilities: [
        {
          ids: [
            {
              text: undefined,
            },
          ],
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('warns when a CVE-like value is obfuscated with invisible/whitespace characters', function () {
    const nonBreakingSpace = '\u00A0'
    const zeroWidthSpace = '\u200B'
    const zeroWidthNonJoiner = '\u200C'
    const zeroWidthJoiner = '\u200D'
    const softHyphen = '\u00AD'
    const wordJoiner = '\u2060'
    const invisibleTimes = '\u2062'
    const invisibleSeparator = '\u2063'
    const invisiblePlus = '\u2064'
    const byteOrderMark = '\uFEFF'
    const combiningAcuteAccent = '\u0301'
    const combiningGraveAccent = '\u034F'
    const mongolianVowelSeparator = '\u180E'
    const tab = '\u0009'
    const newline = '\n'

    const result = normalize(
      `nonBreakingSpace${nonBreakingSpace}zeroWidthSpace${zeroWidthSpace}` +
        `zeroWidthNonJoiner${zeroWidthNonJoiner}zeroWidthJoiner${zeroWidthJoiner}` +
        `softHyphen${softHyphen}wordJoiner${wordJoiner}invisibleTimes${invisibleTimes}` +
        `invisibleSeparator${invisibleSeparator}invisiblePlus${invisiblePlus}byteOrderMark${byteOrderMark}` +
        `combiningAcuteAccent${combiningAcuteAccent}combiningGraveAccent${combiningGraveAccent}` +
        `mongolianVowelSeparator${mongolianVowelSeparator}tab${tab}newline${newline}`
    )

    expect(result).toBe(
      'nonBreakingSpacezeroWidthSpacezeroWidthNonJoinerzeroWidthJoiner' +
        'softHyphenwordJoinerinvisibleTimesinvisibleSeparatorinvisiblePlus' +
        'byteOrderMarkcombiningAcuteAccentcombiningGraveAccentmongolianVowelSeparatortabnewline'
    )
  })
})
