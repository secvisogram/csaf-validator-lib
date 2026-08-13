import { recommendedTest_6_2_1 } from '../../csaf_2_1/recommendedTests.js'

const baseDoc = {
  product_tree: {
    full_product_names: [{ product_id: 'CSAFPID-0001', name: 'Product A' }],
  },
}

describe('recommendedTest_6_2_1', () => {
  it('only runs on relevant documents', async function () {
    expect(
      (await recommendedTest_6_2_1({ vulnerabilities: 'mydoc' })).warnings
        .length
    ).toBe(0)
  })

  it('warns if product_id is unreferenced in product_tree.full_product_names', async function () {
    const result = await recommendedTest_6_2_1({ ...baseDoc })
    expect(result.warnings.length).toBe(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/full_product_names/0/product_id'
    )
    expect(result.warnings[0].message).to.equal('is not referenced')
  })

  it('warns if product_id is unreferenced in product_tree.branches', async function () {
    const result = await recommendedTest_6_2_1({
      product_tree: {
        branches: [
          {
            branches: [
              {
                product: { product_id: 'CSAFPID-0001', name: 'Product A' },
              },
            ],
          },
        ],
      },
    })
    expect(result.warnings.length).toBe(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/branches/0/product/product_id'
    )
  })

  it('warns if product_id is unreferenced in product_tree.product_paths', async function () {
    const result = await recommendedTest_6_2_1({
      product_tree: {
        product_paths: [
          {
            full_product_name: {
              product_id: 'CSAFPID-0001',
              name: 'Product A',
            },
          },
        ],
      },
    })
    expect(result.warnings.length).toBe(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/product_paths/0/full_product_name/product_id'
    )
  })

  it('no warning if product_id is referenced in document.notes[].product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          document: {
            notes: [{ product_ids: ['CSAFPID-0001'] }],
          },
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in product_tree.product_groups.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          product_tree: {
            full_product_names: [
              { product_id: 'CSAFPID-0001', name: 'Product A' },
            ],
            product_groups: [
              {
                group_id: 'CSAFGID-0001',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in product_paths.beginning_product_reference', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          product_tree: {
            product_paths: [{ beginning_product_reference: 'CSAFPID-0001' }],
          },
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in product_paths.subpath.next_product_reference', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          product_tree: {
            product_paths: [
              { subpaths: [{ next_product_reference: 'CSAFPID-0002' }] },
            ],
          },
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.first_known_exploitation_dates.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              first_known_exploitation_dates: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.flags.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              flags: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.ids.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              ids: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities[].involvements[].product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              involvements: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.metrics.products', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              metrics: [
                {
                  products: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities[].notes[].product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              notes: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities[].product_status.unknown', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              product_status: {
                unknown: ['CSAFPID-0001'],
              },
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.remediations.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              remediations: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })

  it('no warning if product_id is referenced in vulnerabilities.threats.product_ids', async function () {
    expect(
      (
        await recommendedTest_6_2_1({
          ...baseDoc,
          vulnerabilities: [
            {
              threats: [
                {
                  product_ids: ['CSAFPID-0001'],
                },
              ],
            },
          ],
        })
      ).warnings.length
    ).toBe(0)
  })
})
