import * as full from '../../csaf_2_1/full.js'
import * as externalRequestFree from '../../csaf_2_1/externalRequestFree.js'
import * as nonExternalRequestFree from '../../csaf_2_1/nonExternalRequestFree.js'

describe('CSAF 2.1 network access presets', function () {
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
