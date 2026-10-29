import { mandatoryTest_6_1_64_1 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_64_1.js'

describe('mandatoryTest_6_1_64_1', function () {
  it('only runs on relevant documents', function () {
    expect(mandatoryTest_6_1_64_1({ product_tree: 'mydoc' }).isValid).to.equal(
      true
    )
  })
})
