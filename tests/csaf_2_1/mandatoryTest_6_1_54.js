vi.mock('#lib/spdx/spdx.js', async (importOriginal) => {
  const real = /** @type {typeof import('#lib/spdx/spdx.js')} */ (
    await importOriginal()
  )
  return { ...real, parse: vi.fn(real.parse) }
})

import { parse } from '#lib/spdx/spdx.js'
import { mandatoryTest_6_1_54 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_54.js'

describe('mandatoryTest_6_1_54', function () {
  afterEach(() => {
    vi.mocked(parse).mockRestore()
  })

  it('only runs on relevant documents', function () {
    expect(
      mandatoryTest_6_1_54({ vulnerabilities: 'mydoc' }).errors.length
    ).to.equal(0)
  })

  it('re-throws non-SyntaxError exceptions from parse()', function () {
    vi.mocked(parse).mockImplementationOnce(() => {
      throw new TypeError('unexpected error')
    })
    expect(() =>
      mandatoryTest_6_1_54({ document: { license_expression: 'MIT' } })
    ).to.throw(TypeError, 'unexpected error')
  })

  it('detects misspelled addition ref keyword in with clause', function () {
    const result = mandatoryTest_6_1_54({
      document: { license_expression: 'LicenseRef-foo WITH additionref-bar' },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
    expect(result.errors[0].instancePath).to.equal(
      '/document/license_expression'
    )
    expect(result.errors[0].message).to.equal(
      'misspelled addition ref keyword: "additionref"'
    )
  })

  it('detects document-ref prefix in with clause addition ref', function () {
    const result = mandatoryTest_6_1_54({
      document: {
        license_expression:
          'LicenseRef-foo WITH DocumentRef-ext:AdditionRef-bar',
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(1)
    expect(result.errors[0].instancePath).to.equal(
      '/document/license_expression'
    )
    expect(result.errors[0].message).to.equal(
      'license expression contains document-ref: "ext"'
    )
  })

  it('recurses into both sides of a compound expression to detect violations', function () {
    const result = mandatoryTest_6_1_54({
      document: {
        license_expression: 'licenseref-left AND licenseref-right',
      },
    })
    expect(result.isValid).to.equal(false)
    expect(result.errors.length).to.equal(2)
    expect(result.errors[0].message).to.equal(
      'misspelled license ref keyword: "licenseref"'
    )
    expect(result.errors[1].message).to.equal(
      'misspelled license ref keyword: "licenseref"'
    )
  })
})
