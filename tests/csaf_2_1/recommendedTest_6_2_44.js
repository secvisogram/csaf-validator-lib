import assert from 'node:assert'
import { expect } from 'chai'
import {
  allDeprecatedInLicenseString,
  recommendedTest_6_2_44,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_44.js'

describe('recommendedTest_6_2_44', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_44({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('check license expressions', function () {
    expect(allDeprecatedInLicenseString('GPL-3.0+')).to.eql([])
    expect(allDeprecatedInLicenseString('GPL-3.0-only')).to.eql([])
    expect(allDeprecatedInLicenseString('MIT OR (Apache-2.0 AND 0BSD)')).to.eql(
      []
    )
    expect(allDeprecatedInLicenseString('Invalid-license-expression')).to.eql(
      []
    )
    expect(allDeprecatedInLicenseString('GPL-2.0 OR BSD-3-Clause')).to.eql([
      'GPL-2.0',
    ])
    expect(
      allDeprecatedInLicenseString('LGPL-2.1 OR BSD-3-Clause AND wxWindows')
    ).to.eql(['LGPL-2.1', 'wxWindows'])
    expect(
      allDeprecatedInLicenseString('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))')
    ).to.eql([])
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
      allDeprecatedInLicenseString('wxWindows'),
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
})
