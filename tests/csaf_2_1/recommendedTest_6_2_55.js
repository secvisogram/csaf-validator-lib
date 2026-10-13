import { recommendedTest_6_2_55 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_55', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_55({
      document: {
        publisher: {
          contact: { public_openpgp_key_url: 123 },
        },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not report a warning when public_openpgp_key_url is undefined', async function () {
    const result = await recommendedTest_6_2_55({
      document: {
        publisher: {
          contact: {},
        },
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
