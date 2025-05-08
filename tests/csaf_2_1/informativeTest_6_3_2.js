import assert from 'node:assert/strict'
import { informativeTest_6_3_2 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_2.js'

describe('informativeTest_6_3_2', function () {
  it('only runs on relevant documents', function () {
    assert.equal(informativeTest_6_3_2({ document: 'mydoc' }).infos.length, 0)
  })
})
