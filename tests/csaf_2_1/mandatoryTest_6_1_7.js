import { expect } from 'chai'
import mandatoryTest_6_1_7 from '../../csaf_2_1/mandatoryTests/mandatoryTest_6_1_7.js'
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
          content: {
            cvss_v3: {},
          },
          products: ['CSAFPID-9080700'],
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

const invalidMandatoryTest6_1_7 = {
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
          content: {
            cvss_v4: {
              version: '4.0',
              vectorString:
                'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H',
              baseScore: 10,
              baseSeverity: 'CRITICAL',
            },
          },
          products: ['CSAFPID-9080700'],
        },
        {
          content: {
            cvss_v4: {
              version: '4.0',
              vectorString:
                'CVSS:4.0/AV:N/AC:L/AT:P/PR:L/UI:N/VC:L/VI:L/VA:N/SC:H/SI:N/SA:N',
              baseScore: 4.9,
              baseSeverity: 'MEDIUM',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
  ],
}

const validMandatoryTest6_1_7 = {
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
          content: {
            cvss_v3: {
              version: '3.1',
              vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
              baseScore: 10,
              baseSeverity: 'CRITICAL',
            },
          },
          products: ['CSAFPID-9080700'],
        },
      ],
    },
    {
      metrics: [
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
  describe('failing examples', function () {
    it('test duplicate product id in cvss_v3 ', async function () {
      expect(csaf_2_1(invalidMandatoryTest6_1_7).isValid).to.be.true
      const result = await mandatoryTest_6_1_7(invalidMandatoryTest6_1_7)
      expect(result.errors).to.have.length.greaterThan(0)
    })
  })

  describe('valid examples', function () {
    it('test duplicate product id different vulnerabilities', async function () {
      expect(csaf_2_1(validMandatoryTest6_1_7).isValid).to.be.true
      const result = await mandatoryTest_6_1_7(validMandatoryTest6_1_7)
      expect(result.errors.length).to.eq(0)
    })
    it('test empty vulnerabilities', async function () {
      const result = await mandatoryTest_6_1_7(emptyMandatoryTest6_1_7)
      expect(result.errors.length).to.eq(0)
    })
    it('test minimal doc', async function () {
      expect(csaf_2_1(minimalDoc).isValid).to.be.true
      const result = await mandatoryTest_6_1_7(minimalDoc)
      expect(result.errors.length).to.eq(0)
    })
  })
})
