import { informativeTest_6_3_8 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_8.js'

describe('informativeTest_6_3_8', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_8({ document: 'mydoc' })
    expect(result.infos.length).to.equal(0)
  })

  it('skips documents without a resolvable language tag', async function () {
    const result = await informativeTest_6_3_8({
      document: { lang: 'not-a-valid-tag!!' },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('skips document/category when it is a known profile category', async function () {
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          category: 'csaf_base',
        },
      },
      {
        hunspell: async () => 'Hunspell v1\n\n# ignored 0',
      }
    )
    expect(result.infos.length).to.equal(0)
  })

  it('checks document/category when it is not a known profile category and reports misspellings without suggestions', async function () {
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          category: 'my_custom_category',
        },
      },
      {
        hunspell: async () => 'Hunspell v1\n\n# custm 0',
      }
    )
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal('/document/category')
    expect(result.infos[0].message).to.match(/custm/)
  })

  it('reports misspelled words that have suggestions', async function () {
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          category: 'my_custom_category',
        },
      },
      {
        hunspell: async () => 'Hunspell v1\n\n& custm 1 0: custom',
      }
    )
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal('/document/category')
    expect(result.infos[0].message).to.match(/custm/)
  })

  it('skips non-string values when walking text fields', async function () {
    let calls = 0
    const result = await informativeTest_6_3_8(
      {
        document: {
          lang: 'en',
          title: 12345,
        },
      },
      {
        hunspell: async () => {
          calls++
          return 'Hunspell v1\n\n'
        },
      }
    )
    expect(calls).to.equal(1)
    expect(result.infos.length).to.equal(0)
  })

  it('builds the dictionary name from language and region subtags', async function () {
    /** @type {string[]} */
    const dictionaries = []
    await informativeTest_6_3_8(
      {
        document: {
          lang: 'en-US',
          category: 'my_custom_category',
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
          category: 'my_custom_category',
        },
      },
      {
        hunspell: async () => 'Hunspell v1\n\n& ',
      }
    )
    expect(result.infos.length).to.equal(1)
    expect(result.infos[0].instancePath).to.equal('/document/category')
    expect(result.infos[0].message).to.match(
      /Error while parsing hunspell output/
    )
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
