import { expect } from 'chai'
import { mandatoryTest_6_1_7 } from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_7.js'
import minimalDoc from './shared/minimalDoc.js'
import csaf_2_1 from '../../csaf_2_1/schemaTests/csaf_2_1.js'

const emptyMandatoryTest6_1_7 = {
  $schema: minimalDoc.$schema,
  document: {
    ...minimalDoc.document,
  },
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
          cvss_v3: {
            version: '2.0',
          },
        },
      ],
    },
    {
      metrics: [
        {
          content: {},
          products: [],
        },
      ],
    },
  ],
}

const failingTestWithNotConsideredObject6_1_7 = {
  $schema: minimalDoc.$schema,
  document: {
    ...minimalDoc.document,
  },
  product_tree: {
    full_product_names: [
      {
        product_id: 'CSAFPID-9080700',
        name: 'Product A',
      },
    ],
  },
  vulnerabilities: [
    {},
    {
      metrics: [
        {
          content: {
            cvss_v3: {
              version: '3.0',
              vectorString: 'CVSS:3.1/AV:L/AC:L/PR:H/UI:R/S:U/C:H/I:H/A:H',
              baseScore: 6.5,
              baseSeverity: 'MEDIUM',
            },
          },
        },
        {
          content: {
            cvss_v3: {
              version: '3.1',
              vectorString: 'CVSS:3.1/AV:L/AC:L/PR:H/UI:R/S:U/C:H/I:H/A:H',
              baseScore: 6.5,
              baseSeverity: 'MEDIUM',
            },
          },
          products: ['CSAFPID-9080700'],
        },
        {
          content: {
            cvss_v3: {
              version: '3.1',
              vectorString: 'CVSS:3.1/AV:L/AC:L/PR:H/UI:R/S:U/C:H/I:H/A:H',
              baseScore: 6.5,
              baseSeverity: 'MEDIUM',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

describe('mandatory test 6.1.7', function () {
  describe('valid examples', function () {
    it('test empty vulnerabilities', async function () {
      const result = mandatoryTest_6_1_7(emptyMandatoryTest6_1_7)
      expect(result.errors.length).to.eq(0)
    })

    it('test input schema  with minimal doc', async function () {
      expect(csaf_2_1(minimalDoc).isValid).to.be.true
      const result = mandatoryTest_6_1_7(minimalDoc)
      expect(result.errors.length).to.eq(0)
    })

    it('test input schema with not considered json object in vulnerabilities', async function () {
      const result = mandatoryTest_6_1_7(
        failingTestWithNotConsideredObject6_1_7
      )
      expect(result.errors.length).to.eq(1)
    })
  })
})
