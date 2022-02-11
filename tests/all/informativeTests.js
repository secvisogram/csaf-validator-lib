const sortObjectKeys = require('../../lib/shared/sortObjectKeys.js')
const minimalDoc = require('../shared/minimalGenericCSAFDoc.js')

module.exports = [
  {
    title:
      'Informative test 6.3.1 detects use of cvss v2 as the only scoring system',
    content: sortObjectKeys(new Intl.Collator(), {
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
          scores: [
            {
              products: ['CSAFPID-9080700'],
              cvss_v2: {
                version: '2.0',
                vectorString: 'AV:N/AC:L/Au:N/C:C/I:C/A:C',
                baseScore: 10,
              },
            },
          ],
        },
      ],
    }),
    expectedNumberOfInfos: 1,
  },
]
