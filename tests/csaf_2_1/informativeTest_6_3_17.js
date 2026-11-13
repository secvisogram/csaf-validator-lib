import { informativeTest_6_3_17 } from '../../csaf_2_1/informativeTests.js'

/** @param {string} license_expression */
const run = (license_expression) =>
  informativeTest_6_3_17({ document: { license_expression } }).infos

describe('informativeTest_6_3_17', function () {
  it('only runs on relevant documents', function () {
    expect(informativeTest_6_3_17({ document: 'mydoc' }).infos.length).to.equal(
      0
    )
    expect(informativeTest_6_3_17({ document: {} }).infos.length).to.equal(0)
  })

  it('check license expressions', function () {
    const messages = (/** @type {string} */ expr) =>
      run(expr).map((i) => i.message)
    const unlisted = (/** @type {string[]} */ ids) =>
      ids.map(
        (id) =>
          `License identifier ${id} is not listed in ` +
          `the SPDX license list or Aboutcode's ScanCode LicenseDB`
      )

    expect(messages('GPL-3.0+'), 'deprecated but listed').to.eql([])
    expect(messages('GPL-3.0-only')).to.eql([])
    expect(messages('MIT OR (Apache-2.0 AND 0BSD)')).to.eql([])
    expect(messages('Invalid license expression')).to.eql([])
    expect(messages('GPL-2.0 OR BSD-3-Clause')).to.eql([])
    expect(messages('LGPL-2.1 OR BSD-3-Clause AND MIT')).to.eql([])
    expect(messages('(MIT AND (LGPL-2.1+ AND BSD-3-Clause))')).to.eql([])
    expect(
      messages('MIT OR Apache-2.0 WITH Autoconf-exception-2.0'),
      'Exception associated with unrelated license'
    ).to.eql([])
    expect(
      messages('3dslicer-1.0'),
      'AboutCode key without LicenseRef-scancode- prefix'
    ).to.eql(unlisted(['3dslicer-1.0']))
  })

  it('accepts listed licenses and exceptions', function () {
    expect(run('MIT').length).to.equal(0)
    expect(run('GPL-3.0-only').length).to.equal(0)
    expect(run('MIT OR (Apache-2.0 AND 0BSD)').length).to.equal(0)
    expect(run('LicenseRef-scancode-acroname-bdk').length).to.equal(0)
    expect(
      run('GPL-2.0-only WITH AdditionRef-scancode-autoconf-exception-2.0')
        .length
    ).to.equal(0)
  })

  it('reports unlisted licenses and exceptions', function () {
    const infos = run('LicenseRef-www.example.com-no-work-pd')
    expect(infos).to.eql([
      {
        instancePath: '/document/license_expression',
        message:
          'License identifier www.example.com-no-work-pd is not listed in ' +
          "the SPDX license list or Aboutcode's ScanCode LicenseDB",
      },
    ])
    expect(
      run('LicenseRef-www.example.com-no-work-pd OR BSD-3-Clause AND MIT')
        .length
    ).to.equal(1)
    expect(run('MIT WITH Custom-Unknown-Exception').length).to.equal(1)
    expect(run('GPL-2.0 OR LGPL-2.1').length).to.equal(0)
  })

  it('skips invalid SPDX expressions', function () {
    expect(run('Invalid license expression').length).to.equal(0)
  })
})
