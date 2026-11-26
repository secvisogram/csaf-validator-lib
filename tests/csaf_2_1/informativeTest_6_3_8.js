import { informativeTest_6_3_8 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_8.js'
import isBrowserRuntime from '../shared/isBrowserRuntime.js'

describe('informativeTest_6_3_8', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_8({ document: 'mydoc' })
    expect(result.infos.length).to.equal(0)
  })

  it('does not collect empty text fields', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      { document: { lang: 'en', title: ' \n ', notes: [{ text: '' }] } },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return 'Hunspell v1\n\n'
        },
      }
    )
    expect(inputs).to.deep.equal([''])
    expect(result.infos).to.deep.equal([])
  })

  it('skips documents without a resolvable language tag', async function () {
    const result = await informativeTest_6_3_8({
      document: { lang: 'not-a-valid-tag!!' },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('skips non-string values when walking text fields', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          title: 12345,
        },
      },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return 'Hunspell v1\n\n'
        },
      }
    )
    expect(inputs.join('')).to.equal('')
    expect(result.infos.length).to.equal(0)
  })

  it('builds the dictionary name from language and region subtags', async function () {
    /** @type {string[]} */
    const dictionaries = []
    await informativeTest_6_3_8(
      {
        document: {
          lang: 'en-US',
          title: 'Hello',
        },
      },
      {
        hunspell: async ({ dictionary }) => {
          dictionaries.push(dictionary)
          return 'Hunspell v1\n\n*'
        },
      }
    )
    expect(dictionaries.length).to.be.greaterThan(0)
    expect(dictionaries.every((d) => d === 'en_US')).to.be.true
  })

  it('reports an info message when a hunspell suggestion line cannot be parsed', async function () {
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          title: 'Hello',
        },
      },
      {
        hunspell: async () => 'Hunspell v1\n\n& ',
      }
    )
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal('/document/lang')
    expect(result.infos[0].message).to.match(
      /Error while parsing hunspell output/
    )
  })

  it('reports a different message when hunspell is not installed', async function () {
    const result = await informativeTest_6_3_8(
      { document: { lang: 'en', title: 'Hello' } },
      {
        hunspell: async () => {
          throw Object.assign(new Error('spawn hunspell ENOENT'), {
            code: 'ENOENT',
          })
        },
      }
    )
    expect(result.infos).to.deep.equal([
      {
        instancePath: '/document/lang',
        message: 'hunspell is not available, spell check was skipped',
      },
    ])
  })

  it('calls hunspell once per document with one line per field and maps blocks to fields', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          title: 'Helo world',
          notes: [{ text: 'world see\nhttps://example.com/a?b=1 wrold' }],
        },
        product_tree: {
          branches: [{ name: 'wrold', branches: [{ name: 'fine' }] }],
        },
      },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return [
            'Hunspell v1',
            '& wrold 1 0: world',
            '*',
            '',
            '& Helo 1 0: Hello',
            '*',
            '',
            '# wrold 0',
            '',
            '*',
            '',
            '',
          ].join('\n')
        },
      }
    )
    expect(inputs.length).to.equal(1)
    expect(inputs[0].split('\n')).to.deep.equal([
      '^world see https://example.com/a?b=1 wrold',
      '^Helo world',
      '^wrold',
      '^fine',
    ])
    expect(result.infos).to.deep.equal([
      {
        instancePath: '/document/notes/0/text',
        message: 'there are spelling mistakes in: wrold',
      },
      {
        instancePath: '/document/title',
        message: 'there are spelling mistakes in: Helo',
      },
      {
        instancePath: '/product_tree/branches/0/name',
        message: 'there are spelling mistakes in: wrold',
      },
    ])
  })

  it('reports each distinct word of a field once and handles CRLF output', async function () {
    const result = await informativeTest_6_3_8(
      { document: { lang: 'en', title: "Secruity's wrold.txt wrold" } },
      {
        hunspell: async () =>
          'Hunspell v1\r\n& Secruity 1 0: Security\r\n& wrold 1 0: world\r\n& txt 1 0: text\r\n& wrold 1 0: world\r\n\r\n',
      }
    )
    expect(result.infos).to.deep.equal([
      {
        instancePath: '/document/title',
        message: 'there are spelling mistakes in: Secruity, wrold, txt',
      },
    ])
  })

  it('never reports CSAF or csaf, e.g. from the category csaf_base', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      {
        document: { lang: 'en', category: 'csaf_base', title: 'CSAF wrold' },
      },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return [
            'Hunspell v1',
            '& CSAF 1 0: USAF',
            '& wrold 1 0: world',
            '',
            '& csaf 1 0: USAF',
            '*',
            '',
            '',
          ].join('\n')
        },
      }
    )
    expect(inputs[0].split('\n')).to.deep.equal(['^CSAF wrold', '^csaf_base'])
    expect(result.infos).to.deep.equal([
      {
        instancePath: '/document/title',
        message: 'there are spelling mistakes in: wrold',
      },
    ])
  })

  it('does not check categories other than csaf_base', async function () {
    /** @type {string[]} */
    const inputs = []
    await informativeTest_6_3_8(
      { document: { lang: 'en', category: 'csaf_vex' } },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return 'Hunspell v1\n\n'
        },
      }
    )
    expect(inputs).to.deep.equal([''])
  })

  it('does not report csaf_base with the real hunspell', async function (ctx) {
    if (isBrowserRuntime) ctx.skip()
    const result = await informativeTest_6_3_8({
      document: { lang: 'en', category: 'csaf_base' },
    })
    if (result.infos[0]?.message.includes('not available')) ctx.skip()
    expect(result.infos).to.deep.equal([])
  })

  it('reports misspelled parts of words with internal punctuation (real hunspell)', async function (ctx) {
    if (isBrowserRuntime) ctx.skip()
    const result = await informativeTest_6_3_8({
      document: {
        lang: 'en-US',
        title: "Secruity's wrold.txt and snake_wrod at https://example.com",
      },
    })
    if (result.infos[0]?.message.includes('not available')) ctx.skip()
    expect(result.infos).to.have.length(1)
    expect(result.infos[0].message).to.contain('Secruity')
    expect(result.infos[0].message).to.contain('wrold')
    expect(result.infos[0].message).to.contain('wrod')
    expect(result.infos[0].message).to.not.contain('example')
  })

  it('does not reject even with the real hunspell process when the dictionary is unknown', async function () {
    const result = await informativeTest_6_3_8({
      document: {
        lang: 'zz',
        title: 'Some title text',
      },
    })
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal('/document/lang')
    expect(result.infos[0].message).to.equal('language "zz" is not supported')
  })
})
