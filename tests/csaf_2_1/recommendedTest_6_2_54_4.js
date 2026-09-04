import { recommendedTest_6_2_54_4 } from '../../csaf_2_1/recommendedTests.js'
import documentation12 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-12.js'

describe('recommendedTest_6_2_54_4', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_54_4({})
    expect(result.warnings.length).to.equal(0)
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await recommendedTest_6_2_54_4({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when "TLP:CLEAR" and the extension is classified as "registered"', async function () {
    const result = await recommendedTest_6_2_54_4({
      document: {
        distribution: {
          tlp: { label: 'CLEAR' },
        },
      },
      x_extensions: [
        {
          $schema: documentation12.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })
})
