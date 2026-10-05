import { informativeTest_6_3_15 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_15', function () {
  it('only runs on relevant documents', function () {
    expect(informativeTest_6_3_15({ document: 'mydoc' }).infos.length).to.equal(
      0
    )
  })

  it('does not flag a namespace extension in a TLP:CLEAR document', function () {
    expect(
      informativeTest_6_3_15({
        document: {
          distribution: {
            tlp: {
              label: 'CLEAR',
            },
          },
        },
        vulnerabilities: [
          {
            metrics: [
              {
                content: {
                  ssvc_v2: {
                    selections: [
                      {
                        namespace: 'ssvc/en-US',
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
      }).infos.length
    ).to.equal(0)
  })
})
