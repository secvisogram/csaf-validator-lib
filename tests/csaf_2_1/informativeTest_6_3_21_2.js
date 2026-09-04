import { informativeTest_6_3_21_2 } from '../../csaf_2_1/informativeTests.js'
import documentation12 from '../../csaf_2_1/csafAjv/extensionSchemas/documentation-12.js'

describe('informativeTest_6_3_21_2', function () {
  it('only runs on relevant documents', async function () {
    const result = await informativeTest_6_3_21_2({ document: 'mydoc' })
    expect(result.infos.length).to.equal(0)
  })

  it('skips extensions that have no $schema property', async function () {
    const result = await informativeTest_6_3_21_2({
      document: {
        distribution: {
          tlp: { label: 'WHITE' },
        },
      },
      x_extensions: [{ category: 'supplementary', content: {} }],
    })
    expect(result.infos.length).to.equal(0)
  })

  it('does not warn when "TLP:CLEAR"', async function () {
    const result = await informativeTest_6_3_21_2({
      document: {
        distribution: {
          tlp: { label: 'CLEAR' },
        },
      },
    })
    expect(result.infos.length).to.equal(0)
  })

  it('does not warn when "TLP:WHITE" and the extension is classified as "registered"', async function () {
    const result = await informativeTest_6_3_21_2({
      document: {
        distribution: {
          tlp: { label: 'WHITE' },
        },
      },
      x_extensions: [
        {
          $schema: documentation12.$id,
          category: 'supplementary',
        },
      ],
    })
    expect(result.infos.length).to.equal(0)
  })
})
