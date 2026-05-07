import assert from 'node:assert'
import { mandatoryTest_6_1_1 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_1.js'

describe('mandatoryTest_6_1_1', function () {
  it('returns no errors when input does not match the schema', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        notes: 'not-an-array',
      }).errors.length,
      0
    )
  })

  it('reports undefined product_id referenced in notes', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        notes: [
          {
            category: 'general',
            text: 'note',
            product_ids: ['CSAFPID-UNDEFINED'],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in flags', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            flags: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in first_known_exploitation_dates', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            first_known_exploitation_dates: [
              { product_ids: ['CSAFPID-UNDEFINED'] },
            ],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in involvements', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            involvements: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in vulnerability notes', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            notes: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in product_status', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            product_status: {
              known_affected: ['CSAFPID-UNDEFINED'],
            },
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in metrics', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            metrics: [{ products: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in remediations', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            remediations: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in threats', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        vulnerabilities: [
          {
            threats: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
          },
        ],
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id referenced in product_groups', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        product_tree: {
          product_groups: [{ product_ids: ['CSAFPID-UNDEFINED'] }],
        },
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id in product_paths beginning_product_reference', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        product_tree: {
          product_paths: [{ beginning_product_reference: 'CSAFPID-UNDEFINED' }],
        },
      }).errors.length,
      1
    )
  })

  it('reports undefined product_id in product_paths subpaths next_product_reference', function () {
    assert.equal(
      mandatoryTest_6_1_1({
        product_tree: {
          product_paths: [
            {
              subpaths: [{ next_product_reference: 'CSAFPID-UNDEFINED' }],
            },
          ],
        },
      }).errors.length,
      1
    )
  })
})
