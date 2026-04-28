import assert from 'node:assert'
import { recommendedTest_6_2_1 } from '../../csaf_2_1/recommendedTests.js'

const baseDoc = {
  product_tree: {
    full_product_names: [{ product_id: 'CSAFPID-0001', name: 'Product A' }],
  },
}

describe('recommendedTest_6_2_1', function () {
  it('only runs on relevant documents', function () {
    assert.equal(
      recommendedTest_6_2_1({ vulnerabilities: 'mydoc' }).warnings.length,
      0
    )
  })

  it('skips documents with category csaf_informational_advisory', function () {
    assert.equal(
      recommendedTest_6_2_1({
        document: { category: 'csaf_informational_advisory' },
        product_tree: {
          full_product_names: [
            { product_id: 'CSAFPID-0001', name: 'Product A' },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in vulnerabilities.remediations.product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            remediations: [
              {
                category: 'vendor_fix',
                details: 'Update.',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warns if product_id appears only in unrelated vulnerability fields', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            remediations: [
              {
                category: 'vendor_fix',
                details: 'Update.',
                product_ids: ['CSAFPID-9999'],
              },
            ],
          },
        ],
      }).warnings.length,
      1
    )
  })

  it('no warning if product_id is referenced in vulnerabilities.metrics.products', function () {
    assert.equal(
      recommendedTest_6_2_1({
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
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in vulnerabilities.flags.product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            flags: [
              {
                label: 'component_not_present',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in vulnerabilities.first_known_exploitation_dates.product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            first_known_exploitation_dates: [
              {
                date: '2024-01-01T00:00:00Z',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in vulnerabilities.threats.product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            threats: [
              {
                category: 'exploit_status',
                details: 'Exploits available.',
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('skips full_product_name entries that have no product_id field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          full_product_names: [{ name: 'Product A without ID' }],
        },
      }).warnings.length,
      0
    )
  })

  it('skips product_path entries that have no full_product_name field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          product_paths: [{ beginning_product_reference: 'CSAFPID-0001' }],
        },
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in product_tree.product_groups.product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
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
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in product_paths.subpaths.next_product_reference', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          full_product_names: [
            { product_id: 'CSAFPID-0001', name: 'Product A' },
            { product_id: 'CSAFPID-0002', name: 'Product B' },
          ],
          product_paths: [
            {
              full_product_name: {
                product_id: 'CSAFPID-0003',
                name: 'Product A on Product B',
              },
              beginning_product_reference: 'CSAFPID-0001',
              subpaths: [{ next_product_reference: 'CSAFPID-0002' }],
            },
          ],
        },
        vulnerabilities: [
          {
            product_status: {
              known_affected: ['CSAFPID-0001', 'CSAFPID-0002', 'CSAFPID-0003'],
            },
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warns if product_id is not referenced and product_group has no product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          full_product_names: [
            { product_id: 'CSAFPID-0001', name: 'Product A' },
          ],
          product_groups: [
            {
              group_id: 'CSAFGID-0001',
            },
          ],
        },
      }).warnings.length,
      1
    )
  })
})
