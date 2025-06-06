import assert from 'node:assert'
import { informativeTest_6_3_17 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_17', function () {
  it('only runs on relevant documents', function () {
    informativeTest_6_3_17({ document: 'mydoc' }).then((result) =>
      assert.equal(result.infos.length, 0)
    )
  })
})
