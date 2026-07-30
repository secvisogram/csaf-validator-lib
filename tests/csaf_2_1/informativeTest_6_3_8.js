import assert from 'node:assert'
import { informativeTest_6_3_8 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_8.js'

describe('informativeTest_6_3_8', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_8({ document: 'mydoc' })
    assert.equal(result.infos.length, 0)
  })

  it('skips documents without a resolvable language tag', async function () {
    const result = await informativeTest_6_3_8({
      document: { lang: 'not-a-valid-tag!!' },
    })
    assert.equal(result.infos.length, 0)
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
    assert.equal(result.infos.length, 0)
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
    assert.equal(result.infos.length, 1)
    assert.equal(result.infos[0].instancePath, '/document/category')
    assert.match(result.infos[0].message, /custm/)
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
    assert.equal(result.infos.length, 1)
    assert.equal(result.infos[0].instancePath, '/document/category')
    assert.match(result.infos[0].message, /custm/)
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
    assert.ok(dictionaries.length > 0)
    assert.ok(dictionaries.every((d) => d === 'en_US'))
  })

  it('throws when a hunspell suggestion line cannot be parsed', async function () {
    await assert.rejects(
      informativeTest_6_3_8(
        {
          document: {
            lang: 'en',
            category: 'my_custom_category',
          },
        },
        {
          hunspell: async () => 'Hunspell v1\n\n& ',
        }
      ),
      /Error while parsing hunspell output/
    )
  })

  it('throws when a hunspell miss line cannot be parsed', async function () {
    await assert.rejects(
      informativeTest_6_3_8(
        {
          document: {
            lang: 'en',
            category: 'my_custom_category',
          },
        },
        {
          hunspell: async () => 'Hunspell v1\n\n# ',
        }
      ),
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
    assert.equal(result.infos.length, 1)
    assert.equal(result.infos[0].instancePath, '/document/lang')
    assert.equal(result.infos[0].message, 'language "zz" is not supported')
  })
})
