import { expect } from 'chai'
import informativeTest_6_3_8 from '../lib/informativeTests/informativeTest_6_3_8.js'
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
