import assert from 'node:assert'
import { informativeTest_6_3_17 } from '../../csaf_2_1/informativeTests.js'
import { checkLicense } from '../../csaf_2_1/informativeTests/informativeTest_6_3_17.js'

describe('informativeTest_6_3_17', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_17({ document: 'mydoc' }).infos.length, 0)
  })

  it('check license expressions', function () {
    assert.equal(checkLicense('GPL-3.0+'), true)
    assert.equal(checkLicense('GPL-3.0-only'), true)
    assert.equal(checkLicense('MIT OR (Apache-2.0 AND 0BSD)'), true)
    assert.equal(checkLicense('Invalid license expression'), false)
    assert.equal(checkLicense('GPL-2.0 OR BSD-3-Clause'), true)
    assert.equal(checkLicense('LGPL-2.1 OR BSD-3-Clause AND MIT'), true)
    assert.equal(checkLicense('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))'), true)
    // Exception associated with unrelated license:
    assert.equal(
      checkLicense('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      false,
      'Exception associated with unrelated license'
    )
    assert.equal(checkLicense('3dslicer-1.0'), true, 'About Code License')

    assert.equal(
      checkLicense('LicenseRef-www.example.com-no-work-pd'),
      false,
      'Valid SPDX expression but invalid license (only License Ref)'
    )

    assert.equal(
      checkLicense(
        'LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT'
      ),
      false,
      'Valid SPDX expression with compound-expression but invalid license (only License Ref)'
    )
  })
})
