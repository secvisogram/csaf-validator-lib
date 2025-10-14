import assert from 'node:assert'
import { expect } from 'chai'
import {
  allNonExistingLicensesInLicenseString,
  recommendedTest_6_2_45,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_45.js'

describe('recommendedTest_6_2_45', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_45({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('check license expressions', function () {
    expect(allNonExistingLicensesInLicenseString('GPL-3.0+')).to.eql([])
    expect(allNonExistingLicensesInLicenseString('GPL-3.0-only')).to.eql([])
    expect(
      allNonExistingLicensesInLicenseString('MIT OR (Apache-2.0 AND 0BSD)')
    ).to.eql([])
    expect(
      allNonExistingLicensesInLicenseString('Invalid-license-expression')
    ).to.eql(['Invalid-license-expression'])
    expect(
      allNonExistingLicensesInLicenseString('GPL-2.0 OR BSD-3-Clause')
    ).to.eql([])
    expect(
      allNonExistingLicensesInLicenseString(
        'LGPL-2.1 OR BSD-3-Clause AND wxWindows'
      )
    ).to.eql([])
    expect(
      allNonExistingLicensesInLicenseString(
        '(MIT AND (LGPL-2.1+ AND BSD-3-Clause))'
      )
    ).to.eql([])
    expect(
      allNonExistingLicensesInLicenseString(
        'MIT OR Apache-2.0 WITH Autoconf-exception-2.0'
      ),
      'Exception associated with unrelated license'
    ).to.eql(['Autoconf-exception-2.0'])
    expect(
      allNonExistingLicensesInLicenseString('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.eql([])

    expect(
      allNonExistingLicensesInLicenseString(
        'LicenseRef-www.example.com-no-work-pd'
      ),
      'Valid SPDX expression with License Ref'
    ).to.eql(['LicenseRef-www.example.com-no-work-pd'])

    expect(
      allNonExistingLicensesInLicenseString(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.eql(['LicenseRef-www.example.com-no-work-pd'])

    expect(
      allNonExistingLicensesInLicenseString('wxWindows'),
      'Deprecated License'
    ).to.eql([])

    expect(
      allNonExistingLicensesInLicenseString(
        'DocumentRef-X:LicenseRef-Y AND MIT'
      ),
      'DocumentRef in License with compound-expression '
    ).to.eql(['LicenseRef-Y'])

    expect(
      allNonExistingLicensesInLicenseString(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.eql(['LicenseRef-www.example.org-Example-CSAF-License-2.0'])

    expect(
      allNonExistingLicensesInLicenseString(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing +'
    ).to.eql(['LicenseRef-www.example.org-Example-CSAF-License-3.0+'])
    expect(
      allNonExistingLicensesInLicenseString('LicenseRef-scancode-acroname-bdk'),
      'LicenseRef in with About Code Prefix and listed license'
    ).to.eql([])

    expect(
      allNonExistingLicensesInLicenseString(
        'LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'
      ),
      'LicenseRef in with About Code Prefix and not listed license'
    ).to.eql(['LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'])
  })
})
