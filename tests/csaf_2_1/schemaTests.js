import { csaf_2_1, csaf_2_1_strict } from '../../csaf_2_1/schemaTests.js'

const minimalValidDocument = {
  $schema: 'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/csaf.json',
  document: {
    title: 'Basic CSAF document',
    csaf_version: '2.1',
    category: 'csaf_base',
    distribution: {
      tlp: { label: 'AMBER' },
    },
    publisher: {
      name: 'Some publisher',
      namespace: 'https://example.com',
      category: 'coordinator',
    },
    tracking: {
      id: 'some-id',
      initial_release_date: '2025-02-18T14:37:32.671Z',
      current_release_date: '2025-06-18T14:37:32.671Z',
      revision_history: [
        {
          date: '2025-02-18T14:37:32.671Z',
          number: '1',
          summary: 'Initial release',
        },
      ],
      version: '1',
      status: 'draft',
    },
  },
}

describe('csaf_2_1_strict', function () {
  it('validates a basic document', function () {
    expect(csaf_2_1_strict(minimalValidDocument).isValid).to.be.ok
  })
})

describe('csaf_2_1', function () {
  it('validates a basic document', function () {
    expect(csaf_2_1(minimalValidDocument).isValid).to.be.ok
  })

  it('accepts CVSS v4 scores that are multiples of 0.1', function () {
    const document = {
      ...minimalValidDocument,
      product_tree: {
        full_product_names: [
          {
            product_id: 'CSAFPID-9080700',
            name: 'Product A',
          },
        ],
      },
      vulnerabilities: [
        {
          metrics: [
            {
              content: {
                cvss_v4: {
                  version: '4.0',
                  vectorString:
                    'CVSS:4.0/AV:N/AC:L/AT:N/PR:L/UI:N/VC:L/VI:L/VA:N/SC:N/SI:N/SA:N',
                  baseScore: 5.3,
                  baseSeverity: 'MEDIUM',
                },
              },
              products: ['CSAFPID-9080700'],
            },
          ],
        },
      ],
    }

    expect(csaf_2_1(document).isValid).to.equal(true)
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
 * @param {number} i
 * @param {number} j
 */
const duplicateItemsError = (instancePath, i, j) => ({
  instancePath,
  schemaPath: '#/uniqueItems',
  keyword: 'uniqueItems',
  params: { i, j },
  message: `must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
})

/**
 * @param {unknown[]} knownAffected
 */
const withKnownAffected = (knownAffected) => ({
  ...minimalValidDocument,
  vulnerabilities: [{ product_status: { known_affected: knownAffected } }],
})

const knownAffectedPath = '/vulnerabilities/0/product_status/known_affected'

for (const [name, schemaTest] of /** @type {const} */ ([
  ['csaf_2_1', csaf_2_1],
  ['csaf_2_1_strict', csaf_2_1_strict],
])) {
  describe(`${name}: duplicate items`, function () {
    it('accepts a long list of distinct product ids', function () {
      expect(schemaTest(withKnownAffected(productIds(40)))).to.deep.equal({
        isValid: true,
        errors: [],
      })
    })

    it('reports a duplicate in a short list of product ids', function () {
      expect(
        schemaTest(
          withKnownAffected(['CSAFPID-0001', 'CSAFPID-0002', 'CSAFPID-0001'])
        )
      ).to.deep.equal({
        isValid: false,
        errors: [duplicateItemsError(knownAffectedPath, 2, 0)],
      })
    })

    it('reports a duplicate at the end of a long list of product ids', function () {
      expect(
        schemaTest(withKnownAffected([...productIds(19), 'CSAFPID-0019']))
          .errors
      ).to.deep.equal([duplicateItemsError(knownAffectedPath, 19, 18)])
    })

    it('reports "__proto__" twice as a duplicate', function () {
      expect(
        schemaTest(
          withKnownAffected([...productIds(18), '__proto__', '__proto__'])
        ).errors
      ).to.deep.equal([duplicateItemsError(knownAffectedPath, 19, 18)])
    })

    it('reports items of the wrong type before the duplicate', function () {
      expect(
        schemaTest(withKnownAffected([...productIds(18), 7, 7])).errors
      ).to.deep.equal([
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
        duplicateItemsError(knownAffectedPath, 19, 18),
      ])
    })

    it('reports a duplicate group id', function () {
      expect(
        schemaTest({
          ...minimalValidDocument,
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
        }).errors
      ).to.deep.equal([
        duplicateItemsError(
          '/vulnerabilities/0/remediations/0/group_ids',
          1,
          0
        ),
      ])
    })
  })
}
