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

  // collectDocumentNotes
  it('no warning if product_id is referenced in document.notes[].product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        document: {
          notes: [{ product_ids: ['CSAFPID-0001'] }],
        },
      }).warnings.length,
      0
    )
  })

  it('warning if note has no product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        document: {
          notes: [{ category: 'general', text: 'note without product_ids' }],
        },
      }).warnings.length,
      1
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

  it('no warning if product_id is referenced in product_paths.beginning_product_reference', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          product_paths: [{ beginning_product_reference: 'CSAFPID-0001' }],
        },
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in product_paths.subpath.next_product_reference', function () {
    assert.equal(
      recommendedTest_6_2_1({
        product_tree: {
          product_paths: [
            { subpaths: [{ next_product_reference: 'CSAFPID-0002' }] },
          ],
        },
      }).warnings.length,
      0
    )
  })

  it('no warning if product_id is referenced in vulnerabilities[].product_status.unknown', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            product_status: {
              unknown: ['CSAFPID-0001'],
            },
          },
        ],
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
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warns if product_id is unreferenced and remediation has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            remediations: [
              {
                category: 'vendor_fix',
                details: 'Update.',
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

  it('warning if product_id is unreferenced and metric has no products field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            metrics: [
              {
                content: {},
              },
            ],
          },
        ],
      }).warnings.length,
      1
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
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warning if product_id is unreferenced and flag has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            flags: [
              {
                label: 'component_not_present',
              },
            ],
          },
        ],
      }).warnings.length,
      1
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
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warning if product_id is unreferenced and first_known_exploitation_date has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            first_known_exploitation_dates: [
              {
                date: '2024-01-01T00:00:00Z',
              },
            ],
          },
        ],
      }).warnings.length,
      1
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
                product_ids: ['CSAFPID-0001'],
              },
            ],
          },
        ],
      }).warnings.length,
      0
    )
  })

  it('warning if product_id is unreferenced and threat has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            threats: [
              {
                category: 'exploit_status',
              },
            ],
          },
        ],
      }).warnings.length,
      1
    )
  })

  it('no warning if product_id is referenced in vulnerabilities[].notes[].product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
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
      }).warnings.length,
      0
    )
  })

  it('warning if product_id is unreferenced and vulnerability note has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            notes: [
              {
                category: 'general',
              },
            ],
          },
        ],
      }).warnings.length,
      1
    )
  })

  it('no warning if product_id is referenced in vulnerabilities[].involvements[].product_ids', function () {
    assert.equal(
      recommendedTest_6_2_1({
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
      }).warnings.length,
      0
    )
  })

  it('warning if product_id is unreferenced and involvement has no product_ids field', function () {
    assert.equal(
      recommendedTest_6_2_1({
        ...baseDoc,
        vulnerabilities: [
          {
            involvements: [
              {
                party: 'vendor',
              },
            ],
          },
        ],
      }).warnings.length,
      1
    )
  })
})
