import { parse } from '#lib/spdx/spdx.js'

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
              type: 'SIMPLE_EXPRESSION',
              value: {
                type: 'LICENSE',
                value: 'GPL-2.0',
              },
              with: null,
            },
            right: {
              type: 'SIMPLE_EXPRESSION',
              value: {
                type: 'LICENSE',
                value: 'MIT',
              },
              with: null,
            },
            type: 'AND_EXPRESSION',
          },
          right: {
            type: 'SIMPLE_EXPRESSION',
            value: {
              type: 'LICENSE',
              value: 'FOO',
            },
            with: {
              keyword: 'AdditionRef',
              prefix: {
                keyword: 'DocumentRef',
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
          type: 'SIMPLE_EXPRESSION',
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
        type: 'SIMPLE_EXPRESSION',
        value: {
          keyword: 'LicenseRef',
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
      type: 'SIMPLE_EXPRESSION',
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
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'GPL-2.0' },
      with: {
        type: 'EXCEPTION',
        value: 'Foo',
      },
    })
  })

  it('parses redundant nested parentheses', () => {
    expect(parse('((MIT))')).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'MIT' },
      with: null,
    })
  })

  it('lets parentheses override the default AND/OR precedence', () => {
    expect(parse('(MIT OR BSD-3-Clause) AND Apache-2.0')).to.deep.equal({
      type: 'AND_EXPRESSION',
      left: {
        type: 'OR_EXPRESSION',
        left: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'MIT' },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'BSD-3-Clause' },
          with: null,
        },
      },
      right: {
        type: 'SIMPLE_EXPRESSION',
        value: { type: 'LICENSE', value: 'Apache-2.0' },
        with: null,
      },
    })
  })

  it('throws on unbalanced or empty parentheses', () => {
    expect(() => parse('(MIT')).to.throw(SyntaxError)
    expect(() => parse('MIT)')).to.throw(SyntaxError)
    expect(() => parse('()')).to.throw(SyntaxError)
  })

  it('throws on empty or whitespace-only input', () => {
    expect(() => parse('')).to.throw(SyntaxError)
    expect(() => parse('   ')).to.throw(SyntaxError)
  })

  it('throws on unconsumed trailing input', () => {
    expect(() => parse('MIT MIT')).to.throw(SyntaxError)
  })

  it('forbids space between a license-id and a following `+`', () => {
    expect(() => parse('MIT +')).to.throw(SyntaxError)
  })

  it('parses a license id with a `+` suffix directly attached', () => {
    expect(parse('GPL-2.0+')).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'GPL-2.0+' },
      with: null,
    })
  })

  it('parses document ref', () => {
    expect(
      parse('DocumentRef-spdx-tool-1.2 : LicenseRef-MIT-Style-2')
    ).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: {
        keyword: 'LicenseRef',
        prefix: {
          keyword: 'DocumentRef',
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

  it('throws on a malformed DocumentRef', () => {
    expect(() => parse('DocumentReffoo:LicenseRef-bar')).to.throw(SyntaxError)
    expect(() => parse('DocumentRef-:LicenseRef-bar')).to.throw(SyntaxError)
    expect(() => parse('DocumentRef-foo LicenseRef-bar')).to.throw(SyntaxError)
  })

  it('throws on a malformed LicenseRef', () => {
    expect(() => parse('DocumentRef-x:LicenseReffoo')).to.throw(SyntaxError)
    expect(() => parse('DocumentRef-x:LicenseRef-')).to.throw(SyntaxError)
  })

  it('falls back to a plain exception id when AdditionRef is malformed', () => {
    expect(parse('MIT WITH AdditionReffoo')).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'MIT' },
      with: { type: 'EXCEPTION', value: 'AdditionReffoo' },
    })
    expect(parse('MIT WITH AdditionRef-')).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'MIT' },
      with: { type: 'EXCEPTION', value: 'AdditionRef-' },
    })
  })

  it('parses `AND`, `OR` and `WITH` with the correct precedence', function () {
    expect(parse('MIT AND BSD-3-Clause AND CC-BY-4.0')).to.deep.equal({
      left: {
        left: {
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'BSD-3-Clause',
          },
          with: null,
        },
        type: 'AND_EXPRESSION',
      },
      right: {
        type: 'SIMPLE_EXPRESSION',
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
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
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
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'CC-BY-4.0',
          },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
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
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'MIT',
          },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
          value: {
            type: 'LICENSE',
            value: 'BSD-3-Clause',
          },
          with: null,
        },
        type: 'AND_EXPRESSION',
      },
      right: {
        type: 'SIMPLE_EXPRESSION',
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

  it('parses license-, document- and additional refs case insensitively', () => {
    expect(
      parse('liceNserEf-foo WITH documentref-asd:additionReF-thing')
    ).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: {
        keyword: 'liceNserEf',
        prefix: null,
        type: 'LICENSE_REF',
        value: 'foo',
      },
      with: {
        keyword: 'additionReF',
        prefix: {
          keyword: 'documentref',
          type: 'DOCUMENT_REF',
          value: 'asd',
        },
        type: 'ADDITION_REF',
        value: 'thing',
      },
    })
  })

  it('requires white space on both sides of `WITH`', () => {
    expect(() => parse('MIT WITHClasspath-exception-2.0')).to.throw(SyntaxError)
  })

  it('parses an AdditionRef without a DocumentRef prefix', () => {
    expect(parse('MIT WITH AdditionRef-foo')).to.deep.equal({
      type: 'SIMPLE_EXPRESSION',
      value: { type: 'LICENSE', value: 'MIT' },
      with: {
        type: 'ADDITION_REF',
        keyword: 'AdditionRef',
        value: 'foo',
        prefix: null,
      },
    })
  })

  it('forbids a second `WITH` clause on the same simple expression', () => {
    expect(() =>
      parse('MIT WITH GCC-exception-2.0 WITH Classpath-exception-2.0')
    ).to.throw(SyntaxError)
  })

  it('forbids `WITH` directly after a parenthesized expression', () => {
    expect(() => parse('(MIT) WITH GCC-exception-2.0')).to.throw(SyntaxError)
  })

  it('requires an exception after `WITH`', () => {
    expect(() => parse('MIT WITH')).to.throw(SyntaxError)
    expect(() => parse('MIT WITH ')).to.throw(SyntaxError)
  })

  it('requires white space on both sides of `AND/OR`', () => {
    expect(() => parse('MIT ANDClasspath-exception-2.0')).to.throw(SyntaxError)
    expect(() => parse('MIT ORClasspath-exception-2.0')).to.throw(SyntaxError)
  })

  it('parses AND chains that mix upper- and lower-case keywords', () => {
    expect(parse('MIT AND BSD-3-Clause and CC-BY-4.0')).to.deep.equal({
      type: 'AND_EXPRESSION',
      left: {
        type: 'AND_EXPRESSION',
        left: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'MIT' },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'BSD-3-Clause' },
          with: null,
        },
      },
      right: {
        type: 'SIMPLE_EXPRESSION',
        value: { type: 'LICENSE', value: 'CC-BY-4.0' },
        with: null,
      },
    })
  })

  it('parses OR chains that mix upper- and lower-case keywords', () => {
    expect(parse('MIT OR BSD-3-Clause or CC-BY-4.0')).to.deep.equal({
      type: 'OR_EXPRESSION',
      left: {
        type: 'OR_EXPRESSION',
        left: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'MIT' },
          with: null,
        },
        right: {
          type: 'SIMPLE_EXPRESSION',
          value: { type: 'LICENSE', value: 'BSD-3-Clause' },
          with: null,
        },
      },
      right: {
        type: 'SIMPLE_EXPRESSION',
        value: { type: 'LICENSE', value: 'CC-BY-4.0' },
        with: null,
      },
    })
  })

  it('throws when a later AND/OR in a chain is glued to the next id', () => {
    expect(() => parse('MIT AND BSD-3-Clause ANDApache-2.0')).to.throw(
      SyntaxError
    )
    expect(() => parse('MIT OR BSD-3-Clause ORApache-2.0')).to.throw(
      SyntaxError
    )
  })

  it('throws on a dangling AND/OR at the end of a chain', () => {
    expect(() => parse('MIT AND BSD-3-Clause AND')).to.throw(SyntaxError)
    expect(() => parse('MIT OR BSD-3-Clause OR')).to.throw(SyntaxError)
  })

  it('requires white space and/or parentheses on both sides of `AND`', () => {
    // Missing separator on either side must be rejected
    expect(() => parse('(MIT)ANDBSD-3-Clause')).to.throw(SyntaxError)
    expect(() => parse('MITAND(BSD-3-Clause)')).to.throw(SyntaxError)
  })
})
