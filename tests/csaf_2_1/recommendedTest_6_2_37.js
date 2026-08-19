import { recommendedTest_6_2_37 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_37', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_37({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('does not warn when content has no ssvc_v2 property', function () {
    expect(
      recommendedTest_6_2_37({
        vulnerabilities: [
          {
            metrics: [
              {
                content: {},
              },
            ],
          },
        ],
      }).warnings.length
    ).to.equal(0)
  })

  it('does not warn when ssvc_v2 has no selections property', function () {
    expect(
      recommendedTest_6_2_37({
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {
                    decision_point_resources: [],
                  },
                },
              },
            ],
          },
        ],
      }).warnings.length
    ).to.equal(0)
  })
})
