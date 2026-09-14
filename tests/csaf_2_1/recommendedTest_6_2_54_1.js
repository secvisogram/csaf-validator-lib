import { recommendedTest_6_2_54_1 } from '../../csaf_2_1/recommendedTests.js'
import documentation11 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-11.js'
import documentation13 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-13.js'

describe('recommendedTest_6_2_54_1', function () {
  it('only runs on relevant documents', async function () {
    const result = await recommendedTest_6_2_54_1({})
    expect(result.warnings.length).to.equal(0)
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await recommendedTest_6_2_54_1({
      x_extensions: [{ category: 'supplementary', content: {} }],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn when the extension schema is classified as "official"', async function () {
    const result = await recommendedTest_6_2_54_1({
      x_extensions: [
        {
          $schema: documentation13.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('warns when the extension schema is classified as "experimental"', async function () {
    const result = await recommendedTest_6_2_54_1({
      x_extensions: [
        {
          $schema: documentation11.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/x_extensions/0')
  })

  it('warns when the extension schema is not in the allow list (unknown)', async function () {
    const result = await recommendedTest_6_2_54_1({
      x_extensions: [
        {
          $schema: 'https://example.com/unknown-extension-schema.json',
          category: 'supplementary',
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal('/x_extensions/0')
  })
})
