import { informativeTest_6_3_26_1 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_26_1 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      informativeTest_6_3_26_1({ document: 'mydoc' }).infos.length,
      0
    )
  })

  it('reports all vulnerabilities if there are no actions', function () {
    const result = informativeTest_6_3_26_1({
      document: { involvement: { actions: [] } },
      vulnerabilities: [{ dl_vuln_id: 'a' }],
    })
    expect(result.infos).to.deep.equal([
      {
        instancePath: '/vulnerabilities/0',
        message: 'the vulnerability is not covered by the involvement',
      },
    ])
  })
})
