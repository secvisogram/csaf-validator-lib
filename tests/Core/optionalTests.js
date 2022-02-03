const minimalDoc = require('../shared/minimalGenericCSAFDoc.js')

module.exports = [
  {
    title: 'Optional test 6.2.2 detects unmatched last_affected entry',
    content: {
      ...minimalDoc,
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
          product_status: {
            last_affected: ['CSAFPID-9080700'],
          },
          scores: [
            {
              products: ['CSAFPID-9080700'],
              cvss_v3: {
                version: '3.0',
                baseScore: 9.8,
                baseSeverity: 'CRITICAL',
                vectorString: 'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
              },
            },
          ],
        },
      ],
    },
    expectedNumberOfWarnings: 1,
  },

  {
    title: 'Optional test 6.2.2 accepts product_ids in remediation',
    content: {
      ...minimalDoc,
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
          product_status: {
            last_affected: ['CSAFPID-9080700'],
          },
          scores: [
            {
              products: ['CSAFPID-9080700'],
              cvss_v3: {
                version: '3.0',
                baseScore: 9.8,
                baseSeverity: 'CRITICAL',
                vectorString: 'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
              },
            },
          ],
          remediations: [
            {
              product_ids: ['CSAFPID-9080700'],
              category: 'none_available',
              details: 'Some details',
            },
          ],
        },
      ],
    },
    expectedNumberOfWarnings: 0,
  },

  {
    title: 'Optional test 6.2.3 detects unmatched first_affected entry',
    content: {
      ...minimalDoc,
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
          product_status: {
            first_affected: ['CSAFPID-9080700'],
          },
          remediations: [
            {
              product_ids: ['CSAFPID-9080700'],
              category: 'none_available',
              details: 'Some details',
            },
          ],
        },
      ],
    },
    expectedNumberOfWarnings: 1,
  },

  {
    title: 'Optional test 6.2.4 detects build metadata in revision history',
    content: {
      ...minimalDoc,
      document: {
        ...minimalDoc.document,
        tracking: {
          ...minimalDoc.document.tracking,
          version: '1.0.0+exp.sha.ac00785',
          initial_release_date: '2021-04-23T10:00:00.000Z',
          current_release_date: '2021-04-23T10:00:00.000Z',
          revision_history: [
            {
              date: '2021-04-23T10:00:00.000Z',
              number: '1.0.0+exp.sha.ac00785',
              summary: 'Initial version.',
            },
          ],
        },
      },
    },
    expectedNumberOfWarnings: 1,
  },

  {
    title:
      'Optional test 6.2.5 detects older initial release date than revision history',
    content: {
      ...minimalDoc,
      document: {
        ...minimalDoc.document,
        tracking: {
          ...minimalDoc.document.tracking,
          version: '2',
          initial_release_date: '2021-04-22T10:00:00.000Z',
          current_release_date: '2021-07-21T11:00:00.000Z',
          revision_history: [
            {
              date: '2021-05-06T10:00:00.000Z',
              number: '1',
              summary: 'Initial version.',
            },
            {
              date: '2021-07-21T11:00:00.000Z',
              number: '2',
              summary: 'Second version.',
            },
          ],
        },
      },
    },
    expectedNumberOfWarnings: 1,
  },

  {
    title:
      'Optional test 6.2.6 detects older current release date than revision history',
    content: {
      ...minimalDoc,
      document: {
        ...minimalDoc.document,
        tracking: {
          ...minimalDoc.document.tracking,
          version: '2',
          initial_release_date: '2021-04-22T10:00:00.000Z',
          current_release_date: '2021-07-21T11:00:00.000Z',
          revision_history: [
            {
              date: '2021-05-06T10:00:00.000Z',
              number: '1',
              summary: 'Initial version.',
            },
            {
              date: '2021-07-21T11:00:00.000Z',
              number: '2',
              summary: 'Second version.',
            },
          ],
        },
      },
    },
    expectedNumberOfWarnings: 1,
  },

  {
    title: 'Optional test 6.2.7 detects missing date in involvements',
    content: {
      ...minimalDoc,
      vulnerabilities: [
        {
          involvements: [
            {
              party: 'vendor',
              status: 'in_progress',
            },
          ],
        },
      ],
    },
    expectedNumberOfWarnings: 1,
  },
]
