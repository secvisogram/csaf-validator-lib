import { recommendedTest_6_2_19 } from '../../csaf_2_1/recommendedTests.js'

describe('recommendedTest_6_2_19', function () {
  it('only runs on relevant documents', function () {
    expect(
      recommendedTest_6_2_19({ vulnerabilities: 'mydoc' }).warnings.length
    ).to.equal(0)
  })

  it('warns when cvss_v2 base metrics are missing', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v2: {
                  vectorString: '',
                },
              },
            },
          ],
        },
      ],
    })
    expect(result.warnings.length).to.equal(1)
  })

  it('warns when cvss_v3 vector is invalid', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v3: {
                  version: '3.1',
                  vectorString: 'INVALID_VECTOR',
                },
              },
            },
          ],
        },
      ],
    })
    // calculatedValue === null → checkCVSS returns true → warning is issued
    expect(result.warnings.length).to.equal(1)
  })

  it('warns when cvss_v2 vectorString is undefined (missing)', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-0001'],
          },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v2: {
                  // kein vectorString → wird zu '' durch ?? ''
                },
              },
            },
          ],
        },
      ],
    })
    // calculatedValue === null → checkCVSS gibt true → Warning
    expect(result.warnings.length).to.equal(1)
  })

  it('does not warn when cvss_v3 environmental score is 0', function () {
    const result = recommendedTest_6_2_19({
      vulnerabilities: [
        {
          product_status: { fixed: ['CSAFPID-0001'] },
          metrics: [
            {
              products: ['CSAFPID-0001'],
              content: {
                cvss_v3: {
                  version: '3.1',
                  vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N',
                  environmentalScore: 0, // nicht > 0
                  // calculatedValue wird 0 sein → nicht > 0 und nicht null
                },
              },
            },
          ],
        },
      ],
    })
    expect(result.warnings.length).to.equal(0)
  })

  describe('fixed products and their metrics', function () {
    const cvssV4 = {
      version: '4.0',
      vectorString:
        'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N',
      baseScore: 9.3,
      baseSeverity: 'CRITICAL',
    }
    const cvssV4WithZeroEnvironmentalScore = {
      ...cvssV4,
      vectorString: `${cvssV4.vectorString}/MVC:N/MVI:N/MVA:N/MSC:N/MSI:N/MSA:N`,
    }
    const cvssV3 = {
      version: '3.1',
      vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      baseScore: 9.8,
      baseSeverity: 'CRITICAL',
    }
    const cvssV3WithZeroEnvironmentalScore = {
      ...cvssV3,
      vectorString: `${cvssV3.vectorString}/MC:N/MI:N/MA:N`,
    }
    const cvssV2 = {
      version: '2.0',
      vectorString: 'AV:N/AC:L/Au:N/C:C/I:C/A:C',
      baseScore: 10,
    }
    const cvssV2WithZeroEnvironmentalScore = {
      ...cvssV2,
      vectorString: `${cvssV2.vectorString}/TD:N`,
    }

    /**
     * @param {string} instancePath
     * @param {string} productID
     */
    const warning = (instancePath, productID) => ({
      instancePath,
      message: `environmental score should be 0 since "${productID}" is listed as fixed`,
    })

    it('does not run on metrics with malformed products', function () {
      expect(
        recommendedTest_6_2_19({
          vulnerabilities: [
            {
              product_status: { fixed: ['CSAFPID-0001'] },
              metrics: [{ products: [42], content: { cvss_v3: cvssV3 } }],
            },
          ],
        }).warnings
      ).to.deep.equal([])
    })

    it('reports each fixed product for each of its metrics, in the order of the fixed products', function () {
      const result = recommendedTest_6_2_19({
        vulnerabilities: [
          {
            product_status: {
              first_fixed: ['CSAFPID-0002', 'CSAFPID-0001'],
              fixed: ['CSAFPID-0003', 'CSAFPID-0002', 'CSAFPID-0004'],
              known_affected: ['CSAFPID-0005'],
            },
            metrics: [
              {
                products: [
                  'CSAFPID-0001',
                  'CSAFPID-0003',
                  'CSAFPID-0001',
                  'CSAFPID-0005',
                ],
                content: { cvss_v2: cvssV2, cvss_v3: cvssV3, cvss_v4: cvssV4 },
              },
              {
                products: ['CSAFPID-0004'],
                content: {
                  cvss_v4: cvssV4WithZeroEnvironmentalScore,
                  cvss_v3: cvssV3WithZeroEnvironmentalScore,
                  cvss_v2: cvssV2WithZeroEnvironmentalScore,
                },
              },
              { content: { cvss_v3: cvssV3 } },
              { products: ['CSAFPID-0002'] },
              {
                products: ['CSAFPID-0003', 'CSAFPID-0002'],
                content: { cvss_v2: cvssV2 },
              },
            ],
          },
          { product_status: { fixed: ['CSAFPID-0001'] } },
          {
            metrics: [
              { products: ['CSAFPID-0001'], content: { cvss_v3: cvssV3 } },
            ],
          },
          {
            product_status: { fixed: ['CSAFPID-0005'] },
            metrics: [
              {
                products: ['CSAFPID-0005'],
                content: {
                  cvss_v3: {
                    ...cvssV3,
                    version: '3.0',
                    vectorString:
                      'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
                  },
                },
              },
            ],
          },
        ],
      })

      expect(result.warnings).to.deep.equal([
        warning('/vulnerabilities/0/metrics/4/cvss_v2', 'CSAFPID-0002'),
        warning('/vulnerabilities/0/metrics/0/cvss_v4', 'CSAFPID-0001'),
        warning('/vulnerabilities/0/metrics/0/cvss_v3', 'CSAFPID-0001'),
        warning('/vulnerabilities/0/metrics/0/cvss_v2', 'CSAFPID-0001'),
        warning('/vulnerabilities/0/metrics/0/cvss_v4', 'CSAFPID-0003'),
        warning('/vulnerabilities/0/metrics/0/cvss_v3', 'CSAFPID-0003'),
        warning('/vulnerabilities/0/metrics/0/cvss_v2', 'CSAFPID-0003'),
        warning('/vulnerabilities/0/metrics/4/cvss_v2', 'CSAFPID-0003'),
        warning('/vulnerabilities/3/metrics/0/cvss_v3', 'CSAFPID-0005'),
      ])
    })

    for (const count of [31, 32, 300]) {
      it(`reports a metric for every one of ${count} fixed products`, function () {
        const productIDs = Array.from(
          { length: count },
          (_, index) => `CSAFPID-${index}`
        )
        const result = recommendedTest_6_2_19({
          vulnerabilities: [
            {
              product_status: { fixed: productIDs },
              metrics: [
                { products: productIDs, content: { cvss_v3: cvssV3 } },
                {
                  products: [...productIDs].reverse(),
                  content: { cvss_v4: cvssV4, cvss_v2: cvssV2 },
                },
                {
                  products: productIDs,
                  content: {
                    cvss_v4: cvssV4WithZeroEnvironmentalScore,
                    cvss_v3: cvssV3WithZeroEnvironmentalScore,
                    cvss_v2: cvssV2WithZeroEnvironmentalScore,
                  },
                },
                { products: ['CSAFPID-OTHER'], content: { cvss_v3: cvssV3 } },
              ],
            },
          ],
        })

        expect(result.warnings).to.deep.equal(
          productIDs.flatMap((productID) => [
            warning('/vulnerabilities/0/metrics/0/cvss_v3', productID),
            warning('/vulnerabilities/0/metrics/1/cvss_v4', productID),
            warning('/vulnerabilities/0/metrics/1/cvss_v2', productID),
          ])
        )
      })
    }
  })
})
