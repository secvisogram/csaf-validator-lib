import { informativeTest_6_3_20 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_20', function () {
  it('only runs on relevant documents', function () {
    expect(informativeTest_6_3_20({ document: 'mydoc' }).infos.length).to.equal(
      0
    )
  })

  it('does not inform when ids array is empty', function () {
    expect(
      informativeTest_6_3_20({
        vulnerabilities: [{ ids: [] }],
      }).infos.length
    ).to.equal(0)
  })

  it('does not inform when ids property is absent', function () {
    expect(
      informativeTest_6_3_20({
        vulnerabilities: [{}],
      }).infos.length
    ).to.equal(0)
  })

  it('does not inform when system_name is undefined', function () {
    expect(
      informativeTest_6_3_20({
        vulnerabilities: [
          {
            ids: [
              {
                system_name: undefined,
              },
            ],
          },
        ],
      }).infos.length
    ).to.equal(0)
  })
})
