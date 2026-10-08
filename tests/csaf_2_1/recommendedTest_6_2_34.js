import { recommendedTest_6_2_34 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_34', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_34({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('skips metric entries without selections', function () {
    expect(
      recommendedTest_6_2_34({
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {},
                },
              },
            ],
          },
        ],
      }).warnings.length
    ).to.equal(0)
  })
})
