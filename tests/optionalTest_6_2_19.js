import optionalTest_6_2_19 from '../lib/optionalTests/optionalTest_6_2_19.js'
import readExampleFiles from './shared/readExampleFiles.js'

const failingExamples = await readExampleFiles(
  new URL('optionalTest_6_2_19/failing', import.meta.url)
)

const validExamples = await readExampleFiles(
  new URL('optionalTest_6_2_19/valid', import.meta.url)
)

describe('Optional test 6.2.19', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, function () {
        const result = optionalTest_6_2_19(failingExample)

        expect(result.warnings.length).to.be.greaterThan(0)
      })
    }
  })

  describe('valid examples', function () {
    for (const [title, validExample] of validExamples) {
      it(title, function () {
        const result = optionalTest_6_2_19(validExample)

        expect(result.warnings.length).to.equal(0)
      })
    }
  })

  it('detects an invalid vector string based environmental score in a 2.0 vector', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            first_fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              cvss_v2: {
                baseScore: 4.3,
                vectorString:
                  'AV:N/AC:H/Au:M/C:P/I:P/A:P/CDP:MH/TD:M/CR:H/IR:H/AR:M',
                version: '2.0',
              },
              products: ['CSAFPID-9080700'],
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  it('can calculate the value based on 2.0 metrics', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              cvss_v2: {
                version: '2.0',
                accessVector: 'NETWORK',
                accessComplexity: 'HIGH',
                authentication: 'MULTIPLE',
                confidentialityImpact: 'NONE',
                integrityImpact: 'NONE',
                availabilityImpact: 'NONE',
                exploitability: 'NOT_DEFINED',
                remediationLevel: 'NOT_DEFINED',
                reportConfidence: 'NOT_DEFINED',
                collateralDamagePotential: 'HIGH',
                targetDistribution: 'MEDIUM',
                confidentialityRequirement: 'HIGH',
                integrityRequirement: 'HIGH',
                availabilityRequirement: 'HIGH',
              },
              products: ['CSAFPID-9080700'],
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  it('can calculate the value based on a 3.0 vector string', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              cvss_v3: {
                baseScore: 5.7,
                baseSeverity: 'MEDIUM',
                vectorString:
                  'CVSS:3.0/AV:N/AC:H/PR:H/UI:R/S:U/C:H/I:L/A:L/E:U/RL:O/RC:U/CR:L/IR:L/AR:L/MAV:P/MAC:H/MPR:H/MUI:N/MS:U/MC:N/MI:N/MA:H',
                version: '3.0',
              },
              products: ['CSAFPID-9080700'],
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  it('can calculate the value based on 3.0 metrics', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              products: ['CSAFPID-9080700'],
              cvss_v3: {
                version: '3.0',
                baseScore: 5.7,
                baseSeverity: 'MEDIUM',
                attackVector: 'NETWORK',
                attackComplexity: 'HIGH',
                privilegesRequired: 'HIGH',
                userInteraction: 'REQUIRED',
                scope: 'UNCHANGED',
                confidentialityImpact: 'HIGH',
                integrityImpact: 'HIGH',
                availabilityImpact: 'NONE',
                modifiedAvailabilityImpact: 'HIGH',
                modifiedIntegrityImpact: 'NONE',
                modifiedConfidentialityImpact: 'NONE',
                exploitCodeMaturity: 'NOT_DEFINED',
                remediationLevel: 'NOT_DEFINED',
                reportConfidence: 'NOT_DEFINED',
                confidentialityRequirement: 'LOW',
                integrityRequirement: 'LOW',
                availabilityRequirement: 'LOW',
                modifiedAttackVector: 'PHYSICAL',
                modifiedAttackComplexity: 'HIGH',
                modifiedPrivilegesRequired: 'HIGH',
                modifiedUserInteraction: 'NONE',
                modifiedScope: 'UNCHANGED',
              },
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  it('can calculate the value based on a 3.1 vector string', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              cvss_v3: {
                baseScore: 5.7,
                baseSeverity: 'MEDIUM',
                vectorString:
                  'CVSS:3.1/AV:N/AC:H/PR:H/UI:R/S:U/C:H/I:L/A:L/E:U/RL:O/RC:U/CR:L/IR:L/AR:L/MAV:P/MAC:H/MPR:H/MUI:N/MS:U/MC:N/MI:N/MA:H',
                version: '3.1',
              },
              products: ['CSAFPID-9080700'],
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  it('can calculate the value based on 3.1 metrics', function () {
    const result = optionalTest_6_2_19({
      vulnerabilities: [
        {
          product_status: {
            fixed: ['CSAFPID-9080700'],
          },
          scores: [
            {
              products: ['CSAFPID-9080700'],
              cvss_v3: {
                version: '3.1',
                baseScore: 5.7,
                baseSeverity: 'MEDIUM',
                attackVector: 'NETWORK',
                attackComplexity: 'HIGH',
                privilegesRequired: 'HIGH',
                userInteraction: 'REQUIRED',
                scope: 'UNCHANGED',
                confidentialityImpact: 'HIGH',
                integrityImpact: 'HIGH',
                availabilityImpact: 'NONE',
                modifiedAvailabilityImpact: 'HIGH',
                modifiedIntegrityImpact: 'NONE',
                modifiedConfidentialityImpact: 'NONE',
                exploitCodeMaturity: 'NOT_DEFINED',
                remediationLevel: 'NOT_DEFINED',
                reportConfidence: 'NOT_DEFINED',
                confidentialityRequirement: 'LOW',
                integrityRequirement: 'LOW',
                availabilityRequirement: 'LOW',
                modifiedAttackVector: 'PHYSICAL',
                modifiedAttackComplexity: 'HIGH',
                modifiedPrivilegesRequired: 'HIGH',
                modifiedUserInteraction: 'NONE',
                modifiedScope: 'UNCHANGED',
              },
            },
          ],
        },
      ],
    })

    expect(result.warnings).to.have.lengthOf(1)
  })

  describe('fixed products and their scores', function () {
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

    it('only runs on relevant documents', function () {
      expect(
        optionalTest_6_2_19({ vulnerabilities: 'mydoc' }).warnings
      ).to.deep.equal([])
      expect(
        optionalTest_6_2_19({
          vulnerabilities: [
            {
              product_status: { fixed: ['CSAFPID-0001'] },
              scores: [{ products: [42], cvss_v3: cvssV3 }],
            },
          ],
        }).warnings
      ).to.deep.equal([])
    })

    it('reports each fixed product for each of its scores, in the order of the fixed products', function () {
      const result = optionalTest_6_2_19({
        vulnerabilities: [
          {
            product_status: {
              first_fixed: ['CSAFPID-0002', 'CSAFPID-0001'],
              fixed: ['CSAFPID-0003', 'CSAFPID-0002', 'CSAFPID-0004'],
              known_affected: ['CSAFPID-0005'],
            },
            scores: [
              {
                products: [
                  'CSAFPID-0001',
                  'CSAFPID-0003',
                  'CSAFPID-0001',
                  'CSAFPID-0005',
                ],
                cvss_v3: cvssV3,
                cvss_v2: cvssV2,
              },
              {
                products: ['CSAFPID-0004'],
                cvss_v3: cvssV3WithZeroEnvironmentalScore,
                cvss_v2: cvssV2WithZeroEnvironmentalScore,
              },
              { cvss_v3: cvssV3 },
              { products: ['CSAFPID-0002'] },
              { products: ['CSAFPID-0003', 'CSAFPID-0002'], cvss_v2: cvssV2 },
            ],
          },
          { product_status: { fixed: ['CSAFPID-0001'] } },
          { scores: [{ products: ['CSAFPID-0001'], cvss_v3: cvssV3 }] },
          {
            product_status: { fixed: ['CSAFPID-0005'] },
            scores: [
              {
                products: ['CSAFPID-0005'],
                cvss_v3: {
                  ...cvssV3,
                  version: '3.0',
                  vectorString: 'CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
                },
              },
            ],
          },
        ],
      })

      expect(result.warnings).to.deep.equal([
        warning('/vulnerabilities/0/scores/4/cvss_v2', 'CSAFPID-0002'),
        warning('/vulnerabilities/0/scores/0/cvss_v3', 'CSAFPID-0001'),
        warning('/vulnerabilities/0/scores/0/cvss_v2', 'CSAFPID-0001'),
        warning('/vulnerabilities/0/scores/0/cvss_v3', 'CSAFPID-0003'),
        warning('/vulnerabilities/0/scores/0/cvss_v2', 'CSAFPID-0003'),
        warning('/vulnerabilities/0/scores/4/cvss_v2', 'CSAFPID-0003'),
        warning('/vulnerabilities/3/scores/0/cvss_v3', 'CSAFPID-0005'),
      ])
    })

    for (const count of [31, 32, 300]) {
      it(`reports a score for every one of ${count} fixed products`, function () {
        const productIDs = Array.from(
          { length: count },
          (_, index) => `CSAFPID-${index}`
        )
        const result = optionalTest_6_2_19({
          vulnerabilities: [
            {
              product_status: { fixed: productIDs },
              scores: [
                { products: productIDs, cvss_v3: cvssV3 },
                { products: [...productIDs].reverse(), cvss_v2: cvssV2 },
                {
                  products: productIDs,
                  cvss_v3: cvssV3WithZeroEnvironmentalScore,
                  cvss_v2: cvssV2WithZeroEnvironmentalScore,
                },
                { products: ['CSAFPID-OTHER'], cvss_v3: cvssV3 },
              ],
            },
          ],
        })

        expect(result.warnings).to.deep.equal(
          productIDs.flatMap((productID) => [
            warning('/vulnerabilities/0/scores/0/cvss_v3', productID),
            warning('/vulnerabilities/0/scores/1/cvss_v2', productID),
          ])
        )
      })
    }
  })
})
