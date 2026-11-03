import { recommendedTest_6_2_51 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_51.js'

/** @param {string} name */
const docWith = (name) => ({
  product_tree: {
    branches: [
      {
        category: 'product_version_range',
        name,
      },
    ],
  },
})

describe('recommendedTest_6_2_51', function () {
  it('skips invalid child branches that do not pass schema validation', async function () {
    const result = await recommendedTest_6_2_51({
      product_tree: { branches: [42, null] },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn for a supported VERS type', async function () {
    const result = await recommendedTest_6_2_51(
      docWith('vers:npm/>1.2.0|<3.91.1')
    )
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn for a supported VERS type with invalid constraints', async function () {
    const result = await recommendedTest_6_2_51(docWith('vers:npm/>1.2'))
    expect(result.warnings.length).to.equal(0)
  })

  it('warns about a VERS type that is not registered', async function () {
    const result = await recommendedTest_6_2_51(docWith('vers:alpm/<4.2.0'))
    expect(result.warnings).to.eql([
      {
        instancePath: '/product_tree/branches/0/name',
        message:
          'usage of unknown version type `alpm` (registered, not supported)',
      },
    ])
  })

  it('ignores branches that are not product version ranges', async function () {
    const result = await recommendedTest_6_2_51({
      product_tree: {
        branches: [{ category: 'product_version', name: 'vers:unknown/1' }],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })
})
