import { expect } from 'chai'
import optionalTest_6_2_19 from '../lib/optionalTests/optionalTest_6_2_19.js'

describe('Optional test 6.2.19', function () {
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
})
