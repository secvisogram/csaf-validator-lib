import { expect } from 'chai'
import { optionalTest_6_2_14 } from '../optionalTests.js'
import readExampleFiles from './shared/readExampleFiles.js'

const failingExamples = await readExampleFiles(
  new URL('optionalTest_6_2_14', import.meta.url)
)

describe('Optional test 6.2.14', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, async function () {
        const result = await optionalTest_6_2_14(failingExample)

        expect(result.warnings).to.haveOwnProperty('length', 1)
      })
    }
  })
})
