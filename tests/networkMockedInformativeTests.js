import { getGlobalDispatcher, setGlobalDispatcher } from 'undici'
import * as informativeTests from '../informativeTests.js'
import * as mandatoryTests from '../mandatoryTests.js'
import * as optionalTests from '../optionalTests.js'
import * as schemaTests from '../schemaTests.js'
import validate from '../validate.js'
import informativeTestTests from './all/informativeTests.js'

// Split out of tests/all.js: this is the only part of the Node-project test suite that
// depends on `undici`'s `MockAgent` to fake HTTP responses, so it's excluded from the
// Vitest browser project (browsers have no `undici`/`node:http`) rather than rewritten
// to be universal.

const { csaf_2_0_strict } = schemaTests

describe('Core', () => {
  describe('informativeTests', () => {
    const globalDispatcher = getGlobalDispatcher()

    afterAll(function () {
      setGlobalDispatcher(globalDispatcher)
    })

    informativeTestTests.forEach((informativeTest, i) => {
      it(informativeTest.title ?? `Optional Test #${i + 1}`, async () => {
        if ('mockAgent' in informativeTest) {
          setGlobalDispatcher(informativeTest.mockAgent())
        }
        const result = await validate(
          [
            csaf_2_0_strict,
            ...Object.values(mandatoryTests),
            ...Object.values(optionalTests),
            ...Object.values(informativeTests).filter(
              (t) => t.name !== 'informativeTest_6_3_8'
            ),
          ],
          informativeTest.content
        )
        expect(result.isValid).to.be.true
        const errors = result.tests.flatMap((t) => t.errors)
        const warnings = result.tests.flatMap((t) => t.warnings)
        const infos = result.tests.flatMap((t) => t.infos)
        expect(errors).to.have.lengthOf(0)
        expect(warnings).to.have.lengthOf(0)
        expect(
          infos.length,
          'Document has the correct number of infos'
        ).to.equal(informativeTest.expectedNumberOfInfos)
      })
    })
  })
})
