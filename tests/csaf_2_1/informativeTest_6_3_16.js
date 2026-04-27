import assert from 'node:assert'
import { informativeTest_6_3_16 } from '../../csaf_2_1/informativeTests.js'
import { expect } from 'chai'

describe('informativeTest_6_3_16', function () {
  it('only runs on relevant documents', async function () {
    assert.equal(
      (await informativeTest_6_3_16({ document: 'mydoc' })).infos.length,
      0
    )
  })

  it('fails if the language is not known', async function () {
    const result = await informativeTest_6_3_16({
      document: {
        lang: 'zz',
      },
    })
    expect(result.infos.length).to.eq(1)
  })
})
