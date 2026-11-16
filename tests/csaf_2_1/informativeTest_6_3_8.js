import { informativeTest_6_3_8 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_8.js'

describe('informativeTest_6_3_8', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_8({ document: 'mydoc' })
    expect(result.infos.length).to.equal(0)
  })

  it('does not collect text fields without words', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      { document: { lang: 'en', title: '!!! --- ...', notes: [{ text: '' }] } },
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
          category: 'csaf_base',
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
          category: 'csaf_base',
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

  it('calls hunspell once per document with unique words and maps results to fields', async function () {
    /** @type {string[]} */
    const inputs = []
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          title: 'Helo world',
          notes: [{ text: 'world see https://example.com/a?b=1 wrold' }],
        },
        product_tree: {
          branches: [{ name: 'wrold', branches: [{ name: 'fine' }] }],
        },
      },
      {
        hunspell: async ({ input }) => {
          inputs.push(input)
          return 'Hunspell v1\n\n& Helo 1 0: Hello\n\n# wrold 0\n\n'
        },
      }
    )
    expect(inputs.length).to.equal(1)
    const words = inputs[0].split('\n')
    expect(words.length).to.equal(new Set(words).size)
    expect(words).to.include('^https://example.com/a?b=1')
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
