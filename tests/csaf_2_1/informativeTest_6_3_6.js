import { informativeTest_6_3_6 } from '../../csaf_2_1/informativeTests.js'

describe('informativeTest_6_3_6', function () {
  it('returns no infos for invalid input', async function () {
    const result = await informativeTest_6_3_6('not-an-object')
    assert.equal(result.infos.length, 0)
  })

  it('skips references without a url', async function () {
    const result = await informativeTest_6_3_6({
      document: {
        references: [{ category: 'external', summary: 'no url given' }],
      },
      vulnerabilities: [
        {
          references: [{ category: 'external', summary: 'no url given' }],
        },
      ],
    })
    assert.equal(result.infos.length, 0)
  })

  it('skips non-string values found at a checked path', async function () {
    const result = await informativeTest_6_3_6({
      product_tree: {
        branches: [
          {
            product: {
              product_identification_helper: {
                sbom_urls: [123],
              },
            },
          },
        ],
      },
    })
    assert.equal(result.infos.length, 0)
  })
})
