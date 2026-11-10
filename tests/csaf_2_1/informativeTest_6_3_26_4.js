import { informativeTest_6_3_26_4 } from '../../csaf_2_1/informativeTests/informativeTest_6_3_26_4.js'

describe('informativeTest_6_3_26_4', function () {
  it('skips documents without entities', function () {
    expect(informativeTest_6_3_26_4({ document: {} }).infos.length).to.equal(0)
  })
})
