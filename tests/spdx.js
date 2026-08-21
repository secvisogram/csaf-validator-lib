import { parse } from '#lib/spdx/parser.js'

describe('spdx/parse()', () => {
  it('can parse', () => {
    expect(
      parse(`
        GPL-2.0 AND MIT
          OR FOO WITH DocumentRef-something:AdditionRef-something
          OR GPL-1.0 WITH MIT
          OR LicenseRef-something
      `)
    ).to.deep.equal({
      left: {
        left: {
          left: {
            left: {
              type: 'WITH_EXPRESSION',
              value: {
                type: 'LICENSE',
                value: 'GPL-2.0',
              },
              with: null,
            },
            right: {
              type: 'WITH_EXPRESSION',
              value: {
                type: 'LICENSE',
                value: 'MIT',
              },
              with: null,
            },
            type: 'AND_EXPRESSION',
          },
          right: {
            type: 'WITH_EXPRESSION',
            value: {
              type: 'LICENSE',
              value: 'FOO',
            },
            with: {
              prefix: {
                type: 'DOCUMENT_REF',
                value: 'something',
              },
              type: 'ADDITION_REF',
              value: 'something',
            },
          },
          type: 'OR_EXPRESSION',
        },
        right: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'GPL-1.0',
          },
          with: {
            type: 'EXCEPTION',
            value: 'MIT',
          },
        },
        type: 'OR_EXPRESSION',
      },
      right: {
        type: 'WITH_EXPRESSION',
        value: {
          prefix: null,
          type: 'LICENSE_REF',
          value: 'something',
        },
        with: null,
      },
      type: 'OR_EXPRESSION',
    })
  })

  it('errors on invalid input', () => {
    expect(() =>
      parse(`
        GPL-2.0 AND
      `)
    ).to.throw(SyntaxError)
  })

  it('parses expression with parentheses', () => {
    expect(
      parse(`
        (GPL-2.0)
      `)
    ).to.deep.equal({
      type: 'WITH_EXPRESSION',
      value: { type: 'LICENSE', value: 'GPL-2.0' },
      with: null,
    })
  })

  it('parses complex expression with parentheses', () => {
    expect(
      parse(`
        (GPL-2.0 WITH Foo)
      `)
    ).to.deep.equal({
      type: 'WITH_EXPRESSION',
      value: { type: 'LICENSE', value: 'GPL-2.0' },
      with: {
        type: 'EXCEPTION',
        value: 'Foo',
      },
    })
  })

  it('forbids space between a license-id and a following `+`', () => {
    expect(() => parse('MIT +')).to.throw(SyntaxError)
  })

  it('parses document ref', () => {
    expect(
      parse('DocumentRef-spdx-tool-1.2 : LicenseRef-MIT-Style-2')
    ).to.deep.equal({
      type: 'WITH_EXPRESSION',
      value: {
        prefix: {
          type: 'DOCUMENT_REF',
          value: 'spdx-tool-1.2',
        },
        type: 'LICENSE_REF',
        value: 'MIT-Style-2',
      },
      with: null,
    })
  })

  it('requires DocumentRefs to be followed by LicenseRef', function () {
    expect(() => parse('DocumentRef-something:x')).to.throw(SyntaxError)
    expect(() => parse('DocumentRef-something:')).to.throw(SyntaxError)
  })

  it('parses `AND`, `OR` and `WITH` with the correct precedence', function () {
    expect(parse('MIT AND BSD-3-Clause AND CC-BY-4.0')).to.deep.equal({
      left: {
        left: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'BSD-3-Clause',
          },
          with: null,
        },
        type: 'AND_EXPRESSION',
      },
      right: {
        type: 'WITH_EXPRESSION',
        value: {
          type: 'LICENSE',
          value: 'CC-BY-4.0',
        },
        with: null,
      },
      type: 'AND_EXPRESSION',
    })

    expect(
      parse(
        'MIT AND BSD-3-Clause WITH GCC-exception-3.1 OR CC-BY-4.0 AND Apache-2.0'
      )
    ).to.deep.equal({
      left: {
        left: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'BSD-3-Clause',
          },
          with: {
            type: 'EXCEPTION',
            value: 'GCC-exception-3.1',
          },
        },
        type: 'AND_EXPRESSION',
      },
      right: {
        left: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'CC-BY-4.0',
          },
          with: null,
        },
        right: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'Apache-2.0',
          },
          with: null,
        },
        type: 'AND_EXPRESSION',
      },
      type: 'OR_EXPRESSION',
    })
  })

  it('allows mixed-case `and`, `or`, and `with`', function () {
    const variants = [
      'MIT and BSD-3-Clause OR GPL-2.0 with GCC-exception-2.0',
      'MIT AND BSD-3-Clause or GPL-2.0 WITH GCC-exception-2.0',
      'MIT and BSD-3-Clause or GPL-2.0 with GCC-exception-2.0',
    ]
    const result = {
      left: {
        left: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'WITH_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'BSD-3-Clause',
          },
          with: null,
        },
        type: 'AND_EXPRESSION',
      },
      right: {
        type: 'WITH_EXPRESSION',
        value: {
          type: 'LICENSE',
          value: 'GPL-2.0',
        },
        with: {
          type: 'EXCEPTION',
          value: 'GCC-exception-2.0',
        },
      },
      type: 'OR_EXPRESSION',
    }

    for (const variant of variants) {
      expect(parse(variant)).to.deep.equal(result)
    }
  })
})
