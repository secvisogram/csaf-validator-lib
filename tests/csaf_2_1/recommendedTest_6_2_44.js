import {
  allDeprecatedInLicenseString,
  recommendedTest_6_2_44,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_44.js'

describe('recommendedTest_6_2_44', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_44({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('check license expressions', function () {
    expect(
      allDeprecatedInLicenseString('LicenseRef-scancode-aop-pd').map(
        (elem) => elem.license_key
      ),
      'LicenseRef in with About Code Prefix and deprecated license'
    ).to.eql(['aop-pd'])
    expect(
      allDeprecatedInLicenseString('GPL-3.0+').map((elem) => elem.license_key)
    ).to.eql(['GPL-3.0+'])
    expect(allDeprecatedInLicenseString('GPL-3.0-only')).to.eql([])
    expect(allDeprecatedInLicenseString('MIT OR (Apache-2.0 AND 0BSD)')).to.eql(
      []
    )
    expect(allDeprecatedInLicenseString('Invalid-license-expression')).to.eql(
      []
    )
    expect(
      allDeprecatedInLicenseString('GPL-2.0 OR BSD-3-Clause').map(
        (elem) => elem.license_key
      )
    ).to.eql(['GPL-2.0'])
    expect(
      allDeprecatedInLicenseString(
        'LGPL-2.1 OR BSD-3-Clause AND wxWindows'
      ).map((elem) => elem.license_key)
    ).to.eql(['LGPL-2.1', 'wxWindows'])
    expect(
      allDeprecatedInLicenseString(
        '(MIT AND (LGPL-2.1+ AND BSD-3-Clause))'
      ).map((elem) => elem.license_key)
    ).to.eql(['LGPL-2.1+'])
    expect(
      allDeprecatedInLicenseString(
        'MIT OR Apache-2.0 WITH Autoconf-exception-2.0'
      ),
      'Exception associated with unrelated license'
    ).to.eql([])
    expect(
      allDeprecatedInLicenseString('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString('LicenseRef-www.example.com-no-work-pd'),
      'Valid SPDX expression with License Ref'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString('wxWindows').map((elem) => elem.license_key),
      'Deprecated License'
    ).to.eql(['wxWindows'])

    expect(
      allDeprecatedInLicenseString('DocumentRef-X:LicenseRef-Y AND MIT'),
      'DocumentRef in License with compound-expression '
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing +'
    ).to.eql([])
    expect(
      allDeprecatedInLicenseString('LicenseRef-scancode-acroname-bdk'),
      'LicenseRef in with About Code Prefix and listed license'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(
        'LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'
      ),
      'LicenseRef in with About Code Prefix and not listed license'
    ).to.eql([])
  })

  it('falsy licenseToCheck returns empty array (line 206)', function () {
    expect(
      allDeprecatedInLicenseString(''),
      'empty string is falsy — returns []'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(null),
      'null is falsy — returns []'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(undefined),
      'undefined is falsy — returns []'
    ).to.eql([])
  })

  it('deprecated SPDX exception triggers warning', function () {
    expect(
      allDeprecatedInLicenseString('MIT WITH Nokia-Qt-exception-1.1').map(
        (elem) => elem.license_key
      ),
      'deprecated SPDX exception'
    ).to.eql(['Nokia-Qt-exception-1.1'])

    expect(
      allDeprecatedInLicenseString('GPL-2.0 WITH Nokia-Qt-exception-1.1').map(
        (elem) => elem.license_key
      ),
      'deprecated SPDX exception detected alongside a deprecated SPDX license'
    ).to.eql(['GPL-2.0', 'Nokia-Qt-exception-1.1'])

    expect(
      allDeprecatedInLicenseString('MIT WITH 389-exception'),
      'non-deprecated SPDX exception does not trigger warning'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString('MIT WITH Autoconf-exception-2.0'),
      'non-deprecated SPDX exception (Autoconf-exception-2.0) does not trigger warning'
    ).to.eql([])
  })

  it('AdditionRef-scancode-* exceptions', function () {
    expect(
      allDeprecatedInLicenseString(
        'MIT WITH AdditionRef-scancode-agpl-3.0-bacula'
      ).map((elem) => elem.license_key),
      'AdditionRef-scancode- with deprecated aboutCode exception'
    ).to.eql(['agpl-3.0-bacula'])

    expect(
      allDeprecatedInLicenseString(
        'MIT WITH AdditionRef-scancode-ada-linking-exception'
      ),
      'AdditionRef-scancode- with non-deprecated aboutCode exception'
    ).to.eql([])

    expect(
      allDeprecatedInLicenseString(
        'GPL-2.0-only WITH AdditionRef-other-custom-exception'
      ),
      'AdditionRef with non-scancode prefix'
    ).to.eql([])
  })
})
