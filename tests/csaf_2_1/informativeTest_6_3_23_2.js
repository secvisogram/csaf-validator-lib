import { informativeTest_6_3_23_2 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_23_2 (CSAF 2.1)', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      informativeTest_6_3_23_2({ document: 'mydoc' }).infos.length,
      0
    )
  })

  it('only runs on relevant category', function () {
    const result = informativeTest_6_3_23_2({
      document: { category: 'csaf_security_advisory' },
      vulnerabilities: [{ cve: 'CVE-1900-0001' }],
    })
    expect(result.infos.length).to.equal(0)
  })

  it('reports vulnerabilities missing a disclosure_date', function () {
    const result = informativeTest_6_3_23_2({
      document: { category: 'csaf_vulnerability_report' },
      vulnerabilities: [{ cve: 'CVE-1900-0001' }],
    })
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal(
      '/vulnerabilities/0/disclosure_date'
    )
  })

  it('does not report vulnerabilities with a disclosure_date', function () {
    const result = informativeTest_6_3_23_2({
      document: { category: 'csaf_vulnerability_report' },
      vulnerabilities: [
        { cve: 'CVE-1900-0001', disclosure_date: '2024-01-01T00:00:00Z' },
      ],
    })
    expect(result.infos.length).to.equal(0)
  })
})
