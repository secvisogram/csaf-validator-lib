import { csaf_2_0, csaf_2_0_strict } from '../schemaTests.js'
import minimalCSAFBaseDoc from './shared/minimalCSAFBaseDoc.js'

describe('Schema test csaf_2_0', function () {
  // Scenario from https://github.com/secvisogram/secvisogram/issues/778:
  // Dates with seconds=60 that are not real leap seconds should be rejected
  // by the date-time format validation in the csaf_2_0 schema validator.
  it('should reject a document with a non-leap-second date with seconds=60', function () {
    const result = csaf_2_0({
      ...minimalCSAFBaseDoc,
      document: {
        ...minimalCSAFBaseDoc.document,
        tracking: {
          ...minimalCSAFBaseDoc.document.tracking,
          revision_history: [
            {
              date: '2026-12-31T23:59:60Z',
              number: '1',
              summary: 'Summary',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.be.false
  })

  it('should accept a document with a real historical leap second date', function () {
    const result = csaf_2_0({
      ...minimalCSAFBaseDoc,
      document: {
        ...minimalCSAFBaseDoc.document,
        tracking: {
          ...minimalCSAFBaseDoc.document.tracking,
          revision_history: [
            {
              date: '2016-12-31T23:59:60Z',
              number: '1',
              summary: 'Summary',
            },
          ],
        },
      },
    })
    expect(result.isValid).to.be.true
  })
})

/**
 * @param {number} count
 */
const productIds = (count) =>
  Array.from(
    { length: count },
    (_, i) => `CSAFPID-${String(i + 1).padStart(4, '0')}`
  )

/**
 * @param {string} instancePath
 * @param {string} schemaPath
 * @param {number} i
 * @param {number} j
 */
const duplicateItemsError = (instancePath, schemaPath, i, j) => ({
  instancePath,
  schemaPath,
  keyword: 'uniqueItems',
  params: { i, j },
  message: `must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
})

/**
 * @param {unknown[]} knownAffected
 */
const withKnownAffected = (knownAffected) => ({
  ...minimalCSAFBaseDoc,
  vulnerabilities: [{ product_status: { known_affected: knownAffected } }],
})

const knownAffectedPath = '/vulnerabilities/0/product_status/known_affected'

for (const [name, schemaTest] of /** @type {const} */ ([
  ['csaf_2_0', csaf_2_0],
  ['csaf_2_0_strict', csaf_2_0_strict],
])) {
  describe(`Schema test ${name}: duplicate items`, function () {
    it('accepts a long list of distinct product ids', function () {
      expect(schemaTest(withKnownAffected(productIds(40)))).to.deep.equal({
        isValid: true,
        errors: [],
      })
    })

    it('reports a duplicate in a short list of product ids', function () {
      const result = schemaTest(
        withKnownAffected(['CSAFPID-0001', 'CSAFPID-0002', 'CSAFPID-0001'])
      )
      expect(result).to.deep.equal({
        isValid: false,
        errors: [duplicateItemsError(knownAffectedPath, '#/uniqueItems', 2, 0)],
      })
    })

    it('reports a duplicate at the end of a long list of product ids', function () {
      const result = schemaTest(
        withKnownAffected([...productIds(19), 'CSAFPID-0019'])
      )
      expect(result.errors).to.deep.equal([
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 19, 18),
      ])
    })

    it('reports a duplicate at the start of a long list of product ids', function () {
      const result = schemaTest(
        withKnownAffected(['CSAFPID-0001', ...productIds(19)])
      )
      expect(result.errors).to.deep.equal([
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 1, 0),
      ])
    })

    it('reports only one pair if an item occurs three times', function () {
      const result = schemaTest(
        withKnownAffected(['CSAFPID-0001', 'CSAFPID-0001', 'CSAFPID-0001'])
      )
      expect(result.errors).to.deep.equal([
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 2, 1),
      ])
    })

    it('reports only one pair if two items are duplicated', function () {
      const result = schemaTest(
        withKnownAffected([
          'CSAFPID-0001',
          'CSAFPID-0002',
          'CSAFPID-0002',
          'CSAFPID-0001',
        ])
      )
      expect(result.errors).to.deep.equal([
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 3, 0),
      ])
    })

    it('reports "__proto__" twice as a duplicate', function () {
      const result = schemaTest(
        withKnownAffected([...productIds(18), '__proto__', '__proto__'])
      )
      expect(result.errors).to.deep.equal([
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 19, 18),
      ])
    })

    it('reports items of the wrong type before the duplicate', function () {
      const result = schemaTest(withKnownAffected([...productIds(18), 7, 7]))
      expect(result.errors).to.deep.equal([
        {
          instancePath: `${knownAffectedPath}/18`,
          schemaPath: '#/$defs/product_id_t/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        },
        {
          instancePath: `${knownAffectedPath}/19`,
          schemaPath: '#/$defs/product_id_t/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        },
        duplicateItemsError(knownAffectedPath, '#/uniqueItems', 19, 18),
      ])
    })

    it('reports a duplicate group id', function () {
      const result = schemaTest({
        ...minimalCSAFBaseDoc,
        vulnerabilities: [
          {
            remediations: [
              {
                category: 'vendor_fix',
                details: 'Update.',
                group_ids: ['CSAFGID-0001', 'CSAFGID-0001'],
              },
            ],
          },
        ],
      })
      expect(result.errors).to.deep.equal([
        duplicateItemsError(
          '/vulnerabilities/0/remediations/0/group_ids',
          '#/uniqueItems',
          1,
          0
        ),
      ])
    })

    it('reports a duplicate product id in a product group', function () {
      const result = schemaTest({
        ...minimalCSAFBaseDoc,
        product_tree: {
          full_product_names: [{ name: 'A', product_id: 'CSAFPID-0001' }],
          product_groups: [
            {
              group_id: 'CSAFGID-0001',
              product_ids: ['CSAFPID-0001', 'CSAFPID-0002', 'CSAFPID-0001'],
            },
          ],
        },
      })
      expect(result.errors).to.deep.equal([
        duplicateItemsError(
          '/product_tree/product_groups/0/product_ids',
          '#/properties/product_tree/properties/product_groups/items/properties/product_ids/uniqueItems',
          2,
          0
        ),
      ])
    })

    it('reports a duplicate object regardless of the order of its keys', function () {
      const result = schemaTest({
        ...minimalCSAFBaseDoc,
        vulnerabilities: [
          {
            ids: [
              { system_name: 'S', text: 'T' },
              { text: 'T', system_name: 'S' },
            ],
          },
        ],
      })
      expect(result.errors).to.deep.equal([
        duplicateItemsError(
          '/vulnerabilities/0/ids',
          '#/properties/vulnerabilities/items/properties/ids/uniqueItems',
          1,
          0
        ),
      ])
    })

    it('reports a duplicate alias', function () {
      const result = schemaTest({
        ...minimalCSAFBaseDoc,
        document: {
          ...minimalCSAFBaseDoc.document,
          tracking: {
            ...minimalCSAFBaseDoc.document.tracking,
            aliases: ['A', 'B', 'A'],
          },
        },
      })
      expect(result.errors).to.deep.equal([
        duplicateItemsError(
          '/document/tracking/aliases',
          '#/properties/document/properties/tracking/properties/aliases/uniqueItems',
          0,
          2
        ),
      ])
    })
  })
}
