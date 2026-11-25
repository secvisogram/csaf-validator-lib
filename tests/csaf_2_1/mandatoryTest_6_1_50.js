import { mandatoryTest_6_1_50 } from '../../csaf_2_1/mandatoryTests.js'
import { isSupportedVersScheme } from '../../csaf_2_1/shared/productVersionRangeHelper/versRangesOverlap.js'

/**
 * @param {string} name
 * @param {unknown[]} [branches]
 */
function range(name, branches) {
  return { category: 'product_version_range', name, branches }
}

/**
 * @param {unknown[]} branches
 */
function docWith(branches) {
  return { product_tree: { branches } }
}

describe('mandatoryTest_6_1_50', function () {
  it('reports no supported scheme before vers-rs is loaded', function () {
    expect(isSupportedVersScheme('semver')).to.equal(false)
  })
  //
  it('only runs on relevant documents', async function () {
    expect(
      (await mandatoryTest_6_1_50({ product_tree: 'mydoc' })).errors.length
    ).to.equal(0)
  })

  it('passes when product_tree has no branches', async function () {
    expect(await mandatoryTest_6_1_50({})).to.deep.equal({
      isValid: true,
      errors: [],
    })
    expect((await mandatoryTest_6_1_50({ product_tree: {} })).isValid).to.equal(
      true
    )
  })

  it('ignores branches with an unexpected shape', async function () {
    const result = await mandatoryTest_6_1_50(docWith([{ category: 1 }]))
    expect(result.isValid).to.equal(true)
  })

  it('ignores other categories and non-string names', async function () {
    const result = await mandatoryTest_6_1_50(
      docWith([
        { category: 'product_version', name: 'vers:semver/<>' },
        { category: 'product_version_range' },
      ])
    )
    expect(result.isValid).to.equal(true)
  })

  it('reports the path of nested branches', async function () {
    const result = await mandatoryTest_6_1_50(
      docWith([
        { category: 'vendor', name: 'v', branches: [range('<1.0')] },
        {
          category: 'vendor',
          name: 'w',
          branches: [range('<1.0'), range('vers:semver/<>1')],
        },
      ])
    )
    expect(result.errors.map((e) => e.instancePath)).to.deep.equal([
      '/product_tree/branches/1/branches/1/name',
    ])
  })
})
