import assert from 'node:assert'
import {
  allNonExistingLicenses,
  recommendedTest_6_2_45,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_45.js'

describe('recommendedTest_6_2_45', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_45({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('check license expressions', function () {
    expect(allNonExistingLicenses('GPL-3.0+')).to.eql(['GPL-3.0+'])
    expect(allNonExistingLicenses('GPL-3.0-only')).to.eql([])
    expect(allNonExistingLicenses('MIT OR (Apache-2.0 AND 0BSD)')).to.eql([])
    expect(allNonExistingLicenses('Invalid-license-expression')).to.eql([
      'Invalid-license-expression',
    ])
    expect(allNonExistingLicenses('GPL-2.0 OR BSD-3-Clause')).to.eql([
      'GPL-2.0',
    ])
    expect(
      allNonExistingLicenses('LGPL-2.1 OR BSD-3-Clause AND wxWindows')
    ).to.eql(['LGPL-2.1', 'wxWindows'])
    expect(
      allNonExistingLicenses('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))')
    ).to.eql(['LGPL-2.1+'])
    expect(
      allNonExistingLicenses('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.eql([])
    expect(
      allNonExistingLicenses('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.eql(['3dslicer-1.0'])

    expect(
      allNonExistingLicenses('LicenseRef-www.example.com-no-work-pd'),
      'Valid SPDX expression with License Ref'
    ).to.eql(['www.example.com-no-work-pd'])

    expect(
      allNonExistingLicenses(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.eql(['www.example.com-no-work-pd'])

    expect(allNonExistingLicenses('wxWindows'), 'Deprecated License').to.eql([
      'wxWindows',
    ])

    expect(
      allNonExistingLicenses('DocumentRef-X:LicenseRef-Y AND MIT'),
      'DocumentRef in License with compound-expression '
    ).to.eql(['Y'])

    expect(
      allNonExistingLicenses(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.eql(['www.example.org-Example-CSAF-License-2.0'])

    expect(
      allNonExistingLicenses(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing +'
    ).to.eql([])
    expect(
      allNonExistingLicenses('LicenseRef-scancode-acroname-bdk'),
      'LicenseRef in with About Code Prefix and listed license'
    ).to.eql([])

    expect(
      allNonExistingLicenses(
        'LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'
      ),
      'LicenseRef in with About Code Prefix and not listed license'
    ).to.eql(['scancode-www.example.org-Example-CSAF-License-3.0'])
  })
})
