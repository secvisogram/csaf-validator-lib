import { informativeTest_6_3_26_3 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_26_3.js'

describe('informativeTest_6_3_26_3', function () {
  it('skips documents without entity_groups', function () {
    expect(informativeTest_6_3_26_3({ document: {} }).infos.length).to.equal(0)
  })
})
