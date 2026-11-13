import { informativeTest_6_3_23_1 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_23_1 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      informativeTest_6_3_23_1({ document: 'mydoc' }).infos.length,
      0
    )
  })

  it('only runs on relevant category', function () {
    const result = informativeTest_6_3_23_1({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{}],
    })
    expect(result.infos.length).to.equal(0)
  })
})
