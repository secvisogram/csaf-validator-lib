import {
  isValidLicenseExpression,
  mandatoryTest_6_1_54,
} from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_54.js'
import { expect } from 'chai'

describe('mandatoryTest_6_1_54', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_54({ document: 'mydoc' }).isValid).to.be.true
  })

  it('check license expressions', function () {
    expect(isValidLicenseExpression('GPL-3.0+')).to.be.true
    expect(isValidLicenseExpression('GPL-3.0-only')).to.be.true
    expect(isValidLicenseExpression('MIT OR (Apache-2.0 AND 0BSD)')).to.be.true
    expect(isValidLicenseExpression('Invalid-license-expression')).to.be.false
    expect(isValidLicenseExpression('GPL-2.0 OR BSD-3-Clause')).to.be.true
    expect(isValidLicenseExpression('LGPL-2.1 OR BSD-3-Clause AND MIT')).to.be
      .true
    expect(isValidLicenseExpression('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))'))
      .to.be.true
    // Exception associated with unrelated license:
    expect(
      isValidLicenseExpression('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.be.false
    expect(
      isValidLicenseExpression('3dslicer-1.0'),
      'SPDX License List matching guidelines'
    ).to.be.true

    expect(
      isValidLicenseExpression('LicenseRef-www.example.com-no-work-pd'),
      'Valid SPDX expression with License Ref'
    ).to.be.true

    expect(
      isValidLicenseExpression(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      'Valid SPDX expression with compound-expression and License Ref'
    ).to.be.true

    expect(isValidLicenseExpression('wxWindows'), 'Deprecated License').to.be
      .true
    expect(
      isValidLicenseExpression('DocumentRef-X:LicenseRef-Y AND MIT'),
      'DocumentRef in License with compound-expression '
    ).to.be.false
    expect(
      isValidLicenseExpression(
        'DocumentRef-some-document-reference:LicenseRef-www.example.org-Example-CSAF-License-2.0'
      ),
      'DocumentRef in License'
    ).to.be.false
    expect(
      isValidLicenseExpression(
        'LicenseRef-www.example.org-Example-CSAF-License-3.0+'
      ),
      'LicenseRef in License with trailing +'
    ).to.be.false
  })
})
