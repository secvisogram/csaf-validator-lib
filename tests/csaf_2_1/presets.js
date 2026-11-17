import * as basic from '../../csaf_2_1/basic.js'
import * as full from '../../csaf_2_1/full.js'
import * as externalRequestFree from '../../csaf_2_1/externalRequestFree.js'
import * as mandatory from '../../csaf_2_1/mandatoryTests.js'
import * as nonExternalRequestFree from '../../csaf_2_1/nonExternalRequestFree.js'

const mandatoryTestsNotIncludedInBasic = ['mandatoryTest_6_1_8']

describe('CSAF 2.1 presets', function () {
  it('exports every implemented mandatory test in the basic preset', function () {
    const basicMandatoryTestNames = Object.keys(basic)
      .filter((testName) => testName.startsWith('mandatoryTest_'))
      .sort()
    const implementedMandatoryTestNames = Object.keys(mandatory)
      .filter(
        (testName) => !mandatoryTestsNotIncludedInBasic.includes(testName)
      )
      .sort()

    expect(basicMandatoryTestNames).to.deep.equal(implementedMandatoryTestNames)
  })

  it('exports exactly the non-external-request-free tests', function () {
    expect(Object.keys(nonExternalRequestFree).sort()).to.deep.equal(
      [
        'recommendedTest_6_2_55',
        'informativeTest_6_3_6',
        'informativeTest_6_3_7',
        'informativeTest_6_3_24',
      ].sort()
    )
  })

  it('splits the full preset into disjoint, complete presets', function () {
    const externalTestNames = Object.keys(externalRequestFree)
    const nonExternalTestNames = Object.keys(nonExternalRequestFree)

    expect(
      externalTestNames.some((testName) =>
        nonExternalTestNames.includes(testName)
      )
    ).to.equal(false)
    expect(
      [...externalTestNames, ...nonExternalTestNames].sort()
    ).to.deep.equal(Object.keys(full).sort())
  })
})
