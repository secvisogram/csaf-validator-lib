import {
  existsNotListedLicenses,
  getLicenseInDocumentLang,
  recommendedTest_6_2_46,
} from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_46.js'
import { expect } from 'chai'
import assert from 'node:assert'

describe('recommendedTest_6_2_46', function () {
  it('only runs on relevant documents', function () {
    assert.equal(recommendedTest_6_2_46({}).warnings.length, 0)
  })

  it('only runs on valid language', function () {
    assert.equal(
      recommendedTest_6_2_46({
        document: { lang: '123', license_expression: 'MIT' },
      }).warnings.length,
      0
    )
  })

  it('check get license in document lang', function () {
    expect(getLicenseInDocumentLang({ document: { lang: 'de' } })).to.eq(
      'Lizenz'
    )
    expect(getLicenseInDocumentLang({ document: { lang: 'es' } })).to.eq(
      undefined
    )
    expect(getLicenseInDocumentLang({ document: {} })).to.eq(undefined)
  })

  it('check license expressions', function () {
    expect(existsNotListedLicenses('GPL-3.0+')).to.be.false
    expect(existsNotListedLicenses('GPL-3.0-only')).to.be.false
    expect(existsNotListedLicenses('MIT OR (Apache-2.0 AND 0BSD)')).to.be.false
    expect(existsNotListedLicenses('Invalid-license-expression')).to.be.true
    expect(existsNotListedLicenses('GPL-2.0 OR BSD-3-Clause')).to.be.false
    expect(existsNotListedLicenses('LGPL-2.1 OR BSD-3-Clause AND MIT')).to.be
      .false
    expect(existsNotListedLicenses('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))')).to
      .be.false
    expect(
      existsNotListedLicenses('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.be.true
    expect(
      existsNotListedLicenses('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.be.false

    expect(
      existsNotListedLicenses('LicenseRef-www.example.com-no-work-pd'),
      'Valid SPDX expression with License Ref'
    ).to.be.true

    expect(
      existsNotListedLicenses(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.be.true

    expect(existsNotListedLicenses('wxWindows'), 'Deprecated License').to.be
      .false

    expect(
      existsNotListedLicenses('DocumentRef-X:LicenseRef-Y AND MIT'),
      'DocumentRef in License with compound-expression '
    ).to.be.true

    expect(
      existsNotListedLicenses(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.be.true

    expect(
      existsNotListedLicenses(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing +'
    ).to.be.true
    expect(
      existsNotListedLicenses('LicenseRef-scancode-acroname-bdk'),
      'LicenseRef in with About Code Prefix and listed license'
    ).to.be.false

    expect(
      existsNotListedLicenses(
        'LicenseRef-scancode-www.example.org-Example-CSAF-License-3.0'
      ),
      'LicenseRef in with About Code Prefix and not listed license'
    ).to.be.true
  })
})
