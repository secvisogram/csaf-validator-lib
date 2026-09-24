import {
  getNotListedLicenses,
  mandatoryTest_6_1_55,
} from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_55.js'
import { describe, it, expect } from 'vitest'

describe('mandatoryTest_6_1_55', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_55({ document: 'mydoc' }).isValid).to.be.true
  })

  it('check license expressions', function () {
    expect(getNotListedLicenses('GPL-3.0+'), 'deprecated license').to.eql([
      'GPL-3.0+',
    ])
    expect(getNotListedLicenses('GPL-3.0-only')).to.be.eql([])
    expect(getNotListedLicenses('MIT OR (Apache-2.0 AND 0BSD)')).to.be.eql([])
    expect(getNotListedLicenses('Invalid-license-expression')).to.be.eql([
      'Invalid-license-expression',
    ])
    expect(
      getNotListedLicenses('GPL-2.0 OR BSD-3-Clause'),
      'deprecated GPL-2.0'
    ).to.be.eql(['GPL-2.0'])
    expect(
      getNotListedLicenses('LGPL-2.1-only OR BSD-3-Clause AND MIT')
    ).to.be.eql([])
    expect(
      getNotListedLicenses('(MIT AND (LGPL-2.1-or-later AND BSD-3-Clause))')
    ).to.eql([])
    expect(
      getNotListedLicenses('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.eql([])
    expect(
      getNotListedLicenses('MIT OR GPL-3.0-only WITH Autoconf-exception-2.0'),
      'Exception associated with valid exception'
    ).to.eql([])
    expect(
      getNotListedLicenses('GPL-3.0-only WITH AdditionRef-exception-2.0'),
      'Exception associated with exception ref'
    ).to.eql([])

    expect(
      getNotListedLicenses('ASWF-Digital-Assets-1.1'),
      'SPDX License List matching guidelines'
    ).to.eql([])

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

    expect(getNotListedLicenses('wxWindows'), 'Deprecated License').to.eql([
      'wxWindows',
    ])

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
      'LicenseRef in License with trailing +'
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
  })

  it('flags license identifiers not listed in the SPDX license list', function () {
    // LicenseRef-* is the SPDX mechanism for custom (non-listed) license
    // identifiers. A plain LicenseRef without an AboutCode prefix is always
    // considered not listed.
    expect(
      getNotListedLicenses('LicenseRef-www.example.org-Custom-License'),
      'Custom LicenseRef not in SPDX list'
    ).to.eql(['LicenseRef-www.example.org-Custom-License'])

    expect(
      getNotListedLicenses('LicenseRef-www.example.org-Custom-License AND MIT'),
      'Custom LicenseRef in compound expression'
    ).to.eql(['LicenseRef-www.example.org-Custom-License'])

    expect(
      getNotListedLicenses(
        'LicenseRef-www.example.org-License-A OR LicenseRef-www.example.org-License-B'
      ),
      'Two custom LicenseRefs in disjunctive expression'
    ).to.eql([
      'LicenseRef-www.example.org-License-A',
      'LicenseRef-www.example.org-License-B',
    ])
  })

  it('flags exceptions not listed in the SPDX exception list', function () {
    // A plain exception id in a WITH clause (parsed as EXCEPTION type) must be
    // in the SPDX exception list; if not, it is flagged as not listed.
    expect(
      getNotListedLicenses('MIT WITH Classpath-exception-2.0'),
      'Exception listed in SPDX exception list'
    ).to.eql([])

    expect(
      getNotListedLicenses('MIT WITH Custom-Unknown-Exception'),
      'Exception not listed in SPDX exception list'
    ).to.eql(['Custom-Unknown-Exception'])

    expect(
      getNotListedLicenses(
        'GPL-2.0-only WITH Custom-Unknown-Exception OR Apache-2.0'
      ),
      'Unlisted exception in compound expression'
    ).to.eql(['Custom-Unknown-Exception'])

    expect(
      getNotListedLicenses(
        'GPL-2.0-only WITH Custom-Exception-A AND MIT WITH Custom-Exception-B'
      ),
      'Two unlisted exceptions in compound expression'
    ).to.eql(['Custom-Exception-A', 'Custom-Exception-B'])
  })

  it('flags AdditionRef-scancode-* exceptions not listed in AboutCode ScanCode LicenseDB', function () {
    // AdditionRef-scancode-<key> refers to an exception from AboutCode's
    // ScanCode LicenseDB. If the key is not in that database the identifier
    // is flagged as not listed.
    expect(
      getNotListedLicenses(
        'GPL-2.0-only WITH AdditionRef-scancode-autoconf-exception-2.0'
      ),
      'AdditionRef-scancode with listed AboutCode exception'
    ).to.eql([])

    expect(
      getNotListedLicenses(
        'GPL-2.0-only WITH AdditionRef-scancode-www.example.org-Custom-Exception'
      ),
      'AdditionRef-scancode with not listed AboutCode exception'
    ).to.eql(['AdditionRef-scancode-www.example.org-Custom-Exception'])

    expect(
      getNotListedLicenses(
        'MIT WITH AdditionRef-scancode-www.example.org-Exc-A OR GPL-2.0-only WITH AdditionRef-scancode-www.example.org-Exc-B'
      ),
      'Two unlisted AdditionRef-scancode exceptions in compound expression'
    ).to.eql([
      'AdditionRef-scancode-www.example.org-Exc-A',
      'AdditionRef-scancode-www.example.org-Exc-B',
    ])
  })
})
