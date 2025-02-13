import { expect } from 'chai'
import informativeTest_6_3_8 from '../lib/informativeTests/informativeTest_6_3_8.js'
import readExampleFiles from './shared/readExampleFiles.js'

const validString = "Informative test: Spell check (failing example 2, Check branches)"

const failingExamples = await readExampleFiles(
  new URL('informativeTest_6_3_8/failing', import.meta.url)
)

describe('Informative test 6.3.8', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, async function () {
        const result = await informativeTest_6_3_8(failingExample, {
          async hunspell({ dictionary, input }) {
            if (validString === input) {
              return 'Hunspell vMOCK\n\n*'
            } else {
              return 'Hunspell vMOCK\n\n# wrongword 1'
            }
          },
        })

        expect(result.infos).to.have.length.greaterThan(0)
      })
    }
  })
})
