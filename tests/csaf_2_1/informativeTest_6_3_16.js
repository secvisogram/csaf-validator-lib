import { informativeTest_6_3_16 } from '../../csaf_2_1/informativeTests.js'
import isBrowserRuntime from '../shared/isBrowserRuntime.js'

describe('informativeTest_6_3_16', function () {
  it('only runs on relevant documents', async function () {
    expect(
      (await informativeTest_6_3_16({ document: 'mydoc' })).infos.length
    ).to.eq(0)
  })

  it('is skipped when no document language is set', async function () {
    const result = await informativeTest_6_3_16({ document: {} })
    expect(result.infos.length).to.eq(0)
  })

  // This test requires a running languagetool server (http://localhost:8010,
  // see dev/languagetool/compose.yml), which is not started for the browser
  // test project - skip it here, analogous to tests/csaf_2_1/oasis.js.
  it.skipIf(isBrowserRuntime)(
    'fails if the language is not known',
    async function () {
      const result = await informativeTest_6_3_16({
        document: {
          lang: 'zz',
        },
      })
      expect(result.infos.length).to.eq(1)
    }
  )
})
