import { recommendedTest_6_2_54_2 } from '../../csaf_2_1/recommendedTests.js'
import documentation11 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-11.js'
import documentation13 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-13.js'

describe('recommendedTest_6_2_54_2', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_54_2({})
    expect(result.warnings.length).to.equal(0)
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await recommendedTest_6_2_54_2({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('warn when the extension schema is not classified as "official"', async function () {
    const result = await recommendedTest_6_2_54_2({
      x_extensions: [
        {
          $schema: documentation11.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/x_extensions/0')
    expect(result.warnings[0].message).to.equal(
      'the extension is not an official CSAF Extension'
    )
  })

  it('does not warn when the extension schema is classified as "official"', async function () {
    const result = await recommendedTest_6_2_54_2({
      x_extensions: [
        {
          $schema: documentation13.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })
})
