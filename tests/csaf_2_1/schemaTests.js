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
