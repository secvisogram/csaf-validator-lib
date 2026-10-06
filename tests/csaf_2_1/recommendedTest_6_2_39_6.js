import { recommendedTest_6_2_39_6 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_39_6.js'

describe('recommendedTest_6_2_39_6', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_39_6({}).warnings.length).to.equal(0)
  })

  it('only runs on category csaf_vulnerability_report', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_base', lang: 'de' },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(0)
  })

  it('returns early when no document language is specified', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report' },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(0)
  })

  it('info on invalid language', function () {
    const result = recommendedTest_6_2_39_6({
      document: {
        category: 'csaf_vulnerability_report',
        lang: '123',
      },
    })
    expect(result.warnings.length).to.equal(0)
    expect(result.infos.length).to.equal(1)
  })

  it('does not warn when the document has no vulnerabilities at all', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report', lang: 'de' },
    })
    expect(result.infos.length).to.equal(0)
    expect(result.warnings.length).to.equal(0)
  })

  it('warns with the correct message when no matching note exists', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report', lang: 'de' },
      vulnerabilities: [{ notes: [{ category: 'summary', title: 'wrong' }] }],
    })
    expect(result.infos.length).to.equal(0)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/vulnerabilities/0/notes')
    expect(result.warnings[0].message).to.equal(
      'for document category "csaf_vulnerability_report" at least one note must exist ' +
        'with title "CVE Beschreibung" or "Schwachstellenzusammenfassung".'
    )
  })

  it('warns with the general message when a vulnerability has no notes property', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report', lang: 'de' },
      vulnerabilities: [{}],
    })
    expect(result.infos.length).to.equal(0)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/vulnerabilities/0/notes')
  })

  it('warns about the specific note when the title matches but the category is wrong', function () {
    const result = recommendedTest_6_2_39_6({
      document: { category: 'csaf_vulnerability_report', lang: 'de' },
      vulnerabilities: [
        {
          notes: [
            { category: 'other', title: 'Schwachstellenzusammenfassung' },
          ],
        },
      ],
    })
    expect(result.infos.length).to.equal(0)
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/vulnerabilities/0/notes/0'
    )
    expect(result.warnings[0].message).to.equal(
      'note with title "Schwachstellenzusammenfassung" should have category "summary" but has "other"'
    )
  })
})
