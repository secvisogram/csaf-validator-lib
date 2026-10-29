import { mandatoryTest_6_1_8 as test } from '../../csaf_2_1/mandatoryTests.js'

describe('mandatoryTest_6_1_8', function () {
  it('only runs on relevant documents', function () {
    expect(test({ vulnerabilities: 'mydoc' }).isValid).to.equal(true)
  })

  it('is valid for a document without vulnerabilities', function () {
    expect(test({}).isValid).to.equal(true)
  })

  it('is valid when metrics/content are absent', function () {
    const doc = {
      vulnerabilities: [{}, { metrics: [] }, { metrics: [{}] }],
    }
    expect(test(doc).isValid).to.equal(true)
  })
})
