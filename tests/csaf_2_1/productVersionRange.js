import {
  collectCtpvrsByProductId,
  collectPvrss,
  filterLeaf,
  filterVls,
  hasOnlyBranches,
  isLeaf,
  isPvrss,
  isPvss,
} from '../../csaf_2_1/shared/productVersionRangeHelper/productVersionRange.js'

/**
 * @param {Partial<import('../../csaf_2_1/shared/productVersionRangeHelper/productVersionRange.js').Sibling>} overrides
 */
const sibling = (overrides) => ({
  category: undefined,
  name: undefined,
  hasBranches: false,
  productId: 'A',
  ...overrides,
})

describe('productVersionRange helper', function () {
  it('classifies siblings', function () {
    expect(isPvrss(sibling({ category: 'product_version_range' }))).to.equal(
      true
    )
    expect(isPvrss(sibling({ category: 'product_version' }))).to.equal(false)
    expect(isPvss(sibling({ category: 'product_version' }))).to.equal(true)
    expect(isPvss(sibling({ category: 'product_version_range' }))).to.equal(
      false
    )
    expect(isLeaf(sibling({}))).to.equal(true)
    expect(isLeaf(sibling({ hasBranches: true }))).to.equal(false)
    expect(isLeaf(sibling({ productId: undefined }))).to.equal(false)
    expect(hasOnlyBranches(sibling({ hasBranches: true }))).to.equal(true)
    expect(hasOnlyBranches(sibling({}))).to.equal(false)
  })

  it('filters in stages: PVRSS, leaf, vls', function () {
    const siblings = [
      sibling({ category: 'product_version_range', name: '>1|<5' }),
      sibling({ category: 'product_version', name: '>1|<5' }),
      sibling({
        category: 'product_version_range',
        name: '>1|<5',
        hasBranches: true,
      }),
      sibling({ category: 'product_version_range', name: 'vers:npm/>1' }),
      sibling({ category: 'product_version_range', name: '>1||' }),
      sibling({ category: 'product_version_range' }),
    ]
    const pvrss = collectPvrss({
      instancePath: '/p',
      ctpvr: siblings[5],
      siblings,
    })
    expect(pvrss).to.have.length(4)
    const leaves = filterLeaf(pvrss)
    expect(leaves).to.have.length(3)
    expect(filterVls(leaves)).to.deep.equal([{ productId: 'A', name: '>1|<5' }])
  })

  it('collects one entry per CTPVR above a product', function () {
    const result = collectCtpvrsByProductId([
      {
        category: 'product_version_range',
        name: '>1',
        branches: [
          {
            category: 'product_version_range',
            name: '<9',
            branches: [{ product: { name: 'A', product_id: 'A' } }],
          },
        ],
      },
    ])
    expect(result.get('A')?.map((entry) => entry.ctpvr.name)).to.deep.equal([
      '>1',
      '<9',
    ])
    expect(collectCtpvrsByProductId(undefined).size).to.equal(0)
  })
})
