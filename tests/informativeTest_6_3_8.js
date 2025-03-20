import { expect } from 'chai'
import informativeTest_6_3_8, {
  urlPattern,
} from '../lib/informativeTests/informativeTest_6_3_8.js'
import readExampleFiles from './shared/readExampleFiles.js'

const failingExamples = await readExampleFiles(
  new URL('informativeTest_6_3_8/failing', import.meta.url)
)

// Word muss match to test csaf/csaf_2.0/test/validator/data/informative/oasis_csaf_tc-csaf_2_0-2021-6-3-08-11.json
// and csaf/csaf_2.0/test/validator/data/informative/oasis_csaf_tc-csaf_2_0-2021-6-3-08-01.json

const hunspellMap = new Map([
  ['Security', '*'],
  ['researchers', '*'],
  ['found', '*'],
  ['multiple', '*'],
  ['vulnerabilities', '*'],
  ['in', '*'],
  ['XYZ', '*'],
  ['Secruity', '# error'],
  ['OASIS', '*'],
  ['CSAF', '*'],
  ['TC', '*'],
  ['Informative', '*'],
  ['test', '*'],
  ['Spell', '*'],
  ['check', '*'],
  ['valid', '*'],
  ['example', '*'],
  ['failing', '*'],
  ['1', '*'],
  ['Initial', '*'],
  ['version', '*'],
  ['1', '*'],
  ['1', '*'],
])

describe('Informative test 6.3.8', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, async function () {
        const result = await informativeTest_6_3_8(failingExample, {
          async hunspell({ dictionary, input }) {
            const answer = hunspellMap.get(input)
            if (answer) {
              return 'Hunspell vMOCK\n\n' + answer
            } else {
              throw new Error('Hunspell vMOCK. Unknoww word ' + input)
            }
          },
        })

        expect(result.infos).to.have.length.greaterThan(0)
      })
    }
  })
})

describe('Check URL pattern match', function () {
  it('valid URLS', async function () {
    expect(urlPattern.test('https://example.com'), 'Standard URL').to.be.true
    expect(
      urlPattern.test('https://stackoverflow.com/'),
      'Standard URL with slash at end'
    ).to.be.true
    expect(
      urlPattern.test('https://example.com/search?q=apple&category=fruits'),
      'Url with query'
    ).to.be.true
    expect(
      urlPattern.test('http://example.com/search?q=apple&category=fruits'),
      'Url with query and http'
    ).to.be.true
    expect(urlPattern.test('http://localhost'), 'Url with localhost').to.be.true
    expect(
      urlPattern.test('http://example.com/data.csv#cell=4,1-6,2'),
      'Url with fragment'
    ).to.be.true
    expect(
      urlPattern.test('http://www.ietf.org/rfc/rfc2396.txt'),
      'Url to document'
    ).to.be.true
    expect(
      urlPattern.test('http://example.com:8042/over/there?name=ferret#nose'),
      'Url with port'
    ).to.be.true
    expect(
      urlPattern.test('http://127.0.0.0:8080/over/there?name=ferret#nose'),
      'Url with ip address'
    ).to.be.true
  })

  it('invalid URLS', async function () {
    expect(urlPattern.test('htt://example'), "Url with wrong schema").to.be.false
    expect(urlPattern.test('https:/example'), "Url with missing slash").to.be.false
  })
})
