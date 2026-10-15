import {
  getNotListedLicenses,
  recommendedTest_6_2_46,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_46.js'

describe('recommendedTest_6_2_46', function () {
  it('only runs on relevant documents', function () {
    expect(recommendedTest_6_2_46({}).warnings.length).to.eql(0)
  })

  it('check license expressions', function () {
    expect(getNotListedLicenses('GPL-3.0+')).to.eql([])
    expect(getNotListedLicenses('GPL-3.0-only')).to.be.eql([])
    expect(getNotListedLicenses('MIT OR (Apache-2.0 AND 0BSD)')).to.be.eql([])
    expect(getNotListedLicenses('Invalid-license-expression')).to.be.eql([
      'Invalid-license-expression',
    ])
    expect(getNotListedLicenses('GPL-2.0 OR BSD-3-Clause')).to.be.eql([])
    expect(getNotListedLicenses('LGPL-2.1 OR BSD-3-Clause AND MIT')).to.be.eql(
      []
    )
    expect(
      getNotListedLicenses('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))')
    ).to.eql([])
    expect(
      getNotListedLicenses('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.eql([])
    expect(
      getNotListedLicenses('MIT WITH Unknown-exception'),
      'Unknown SPDX exception'
    ).to.eql(['Unknown-exception'])
    expect(
      getNotListedLicenses('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.eql(['3dslicer-1.0'])

    expect(
      getNotListedLicenses('LicenseRef-www.example.com-no-work-pd'),
      'Valid SPDX expression with License Ref'
    ).to.eql(['LicenseRef-www.example.com-no-work-pd'])

    expect(
      getNotListedLicenses(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.eql(['LicenseRef-www.example.com-no-work-pd'])

    expect(getNotListedLicenses('wxWindows'), 'Deprecated License').to.eql([])

    expect(
      getNotListedLicenses('DocumentRef-X:LicenseRef-Y AND LicenseRef-X'),
      'DocumentRef in License with compound-expression'
    ).to.eql(['LicenseRef-Y', 'LicenseRef-X'])

    expect(
      getNotListedLicenses(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.eql(['LicenseRef-www.example.org-Example-CSAF-License-2.0'])

    expect(
      getNotListedLicenses(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing + (invalid expression)'
    ).to.eql([])
    expect(
      getNotListedLicenses('LicenseRef-scancode-acroname-bdk'),
      'LicenseRef in with About Code Prefix and listed license'
    ).to.eql([])

    expect(
      getNotListedLicenses(
        'LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'
      ),
      'LicenseRef in with About Code Prefix and not listed license'
    ).to.eql(['LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'])

    expect(
      getNotListedLicenses(
        'MIT WITH AdditionRef-scancode-autoconf-exception-2.0'
      ),
      'AboutCode AdditionRef exception'
    ).to.eql([])
    expect(
      getNotListedLicenses('MIT WITH AdditionRef-example'),
      'Unknown AdditionRef exception'
    ).to.eql(['AdditionRef-example'])
    expect(
      getNotListedLicenses(
        'MIT OR (Apache-2.0 WITH AdditionRef-scancode-autoconf-exception-2.0)'
      ),
      'AboutCode AdditionRef exception in compound expression'
    ).to.eql([])
    expect(getNotListedLicenses(null), 'Missing license expression').to.eql([])
  })

  it('skips documents without a supported language translation', function () {
    expect(
      recommendedTest_6_2_46({
        document: {
          license_expression: 'Invalid-license-expression',
        },
      }).warnings
    ).to.eql([])
    expect(
      recommendedTest_6_2_46({
        document: {
          lang: 'fr',
          license_expression: 'Invalid-license-expression',
        },
      }).warnings
    ).to.eql([])
  })

  it('warns when a non-English document has unlisted licenses but no matching disclaimer', function () {
    expect(
      recommendedTest_6_2_46({
        document: {
          lang: 'de',
          license_expression: 'Invalid-license-expression',
        },
      }).warnings
    ).to.eql([
      {
        instancePath: '/document/notes',
        message:
          'The license_expression contains contains the following license identifiers that are nor listed in Aboutcode or SPDX license list: "Invalid-license-expression". Therefore exactly one note with title "License" and category "legal_disclaimer" must exist',
      },
    ])
  })
})
