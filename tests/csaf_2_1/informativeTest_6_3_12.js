import assert from 'node:assert'
import { informativeTest_6_3_12 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_12', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_12({ document: 'mydoc' }).infos.length, 0)
  })
})
