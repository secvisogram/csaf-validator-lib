import Ajv from 'ajv/dist/jtd.js'
import cvss2js from 'cvss2js'
import { cvss30, cvss31 } from '../shared/first.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              fixed: {
                elements: { type: 'string' },
              },
              first_fixed: {
                elements: { type: 'string' },
              },
            },
          },
          scores: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                cvss_v3: {
                  additionalProperties: true,
                  optionalProperties: {
                    environmentalScore: { type: 'float64' },
                    vectorString: { type: 'string' },
                    version: { type: 'string' },
                  },
                },
                cvss_v2: {
                  additionalProperties: true,
                  optionalProperties: {
                    environmentalScore: { type: 'float64' },
                    vectorString: { type: 'string' },
                    version: { type: 'string' },
                  },
                },
                products: {
                  elements: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
})
const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_19(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const fixedProductIDs = [
      ...(vulnerability.product_status?.first_fixed ?? []),
      ...(vulnerability.product_status?.fixed ?? []),
    ]
    fixedProductIDs.forEach((productID) => {
      vulnerability.scores?.forEach((score, scoreIndex) => {
        if (!score.products?.includes(productID)) return
        if (score.cvss_v3) {
          const calculatedValue =
            score.cvss_v3.version === '3.1' || score.cvss_v3.version === '3.0'
              ? typeof score.cvss_v3.vectorString === 'string'
                ? calculateEnvironmentalScoreFromVectorString({
                    version: score.cvss_v3.version,
                    vectorString: score.cvss_v3.vectorString,
                  })
                : calculateEnvironmentalScoreFromMetrics({
                    version: score.cvss_v3.version,
                    metrics: score.cvss_v3,
                  })
              : null
          if (
            (typeof score.cvss_v3.environmentalScore === 'number' &&
              score.cvss_v3.environmentalScore > 0) ||
            (typeof calculatedValue === 'number' && calculatedValue > 0)
          ) {
            ctx.warnings.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/cvss_v3`,
              message: `environmental score should be 0 since "${productID}" is listed as fixed`,
            })
          }
        }
        if (score.cvss_v2) {
          const calculatedValue =
            typeof score.cvss_v2.vectorString === 'string'
              ? calculateEnvironmentalScoreFromVectorString({
                  version: '2.0',
                  vectorString: score.cvss_v2.vectorString,
                })
              : calculateEnvironmentalScoreFromMetrics({
                  version: '2.0',
                  metrics: score.cvss_v2,
                })
          if (
            (typeof score.cvss_v2.environmentalScore === 'number' &&
              score.cvss_v2.environmentalScore > 0) ||
            (typeof calculatedValue === 'number' && calculatedValue !== 0)
          ) {
            ctx.warnings.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/cvss_v3`,
              message: `environmental score should be 0 since "${productID}" is listed as fixed`,
            })
          }
        }
      })
    })
  })

  return ctx
}

/**
 * @param {object} params
 * @param {'2.0' | '3.0' | '3.1'} params.version
 * @param {string} params.vectorString
 */
function calculateEnvironmentalScoreFromVectorString({
  version,
  vectorString,
}) {
  if (version === '3.1') {
    const score = cvss31.calculateCVSSFromVector(vectorString)
    if (!score.success) return null
    return Number(score.environmentalMetricScore)
  } else if (version === '3.0') {
    const score = cvss30.calculateCVSSFromVector(vectorString)
    if (!score.success) return null
    return Number(score.environmentalMetricScore)
  } else {
    const score = safelyParseCVSSV2Vector(vectorString)
    if (!score.success) return null
    return score.environmentalMetricScore
  }
}

const cvss2Mapping = /** @type {const} */ ([
  // BASE SCORE
  [
    'accessVector',
    'AV',
    {
      NETWORK: 'N',
      ADJACENT_NETWORK: 'A',
      LOCAL: 'L',
    },
  ],
  [
    'accessComplexity',
    'AC',
    {
      HIGH: 'H',
      MEDIUM: 'M',
      LOW: 'L',
    },
  ],
  ['authentication', 'Au', { MULTIPLE: 'M', SINGLE: 'S', NONE: 'N' }],
  [
    'confidentialityImpact',
    'C',
    {
      NONE: 'N',
      PARTIAL: 'P',
      COMPLETE: 'C',
    },
  ],
  [
    'integrityImpact',
    'I',
    {
      NONE: 'N',
      PARTIAL: 'P',
      COMPLETE: 'C',
    },
  ],
  [
    'availabilityImpact',
    'A',
    {
      NONE: 'N',
      PARTIAL: 'P',
      COMPLETE: 'C',
    },
  ],

  // TEMPORAL SCORE
  [
    'exploitability',
    'E',
    {
      UNPROVEN: 'U',
      PROOF_OF_CONCEPT: 'POC',
      FUNCTIONAL: 'F',
      HIGH: 'H',
      NOT_DEFINED: 'ND',
    },
  ],
  [
    'remediationLevel',
    'RL',
    {
      OFFICIAL_FIX: 'OF',
      TEMPORARY_FIX: 'TF',
      WORKAROUND: 'W',
      UNAVAILABLE: 'U',
      NOT_DEFINED: 'ND',
    },
  ],

  [
    'reportConfidence',
    'RC',
    {
      UNCONFIRMED: 'UC',
      UNCORROBORATED: 'UR',
      CONFIRMED: 'C',
      NOT_DEFINED: 'ND',
    },
  ],

  // ENVIRONMENTAL SCORE
  [
    'collateralDamagePotential',
    'CDP',
    {
      NONE: 'N',
      LOW: 'L',
      LOW_MEDIUM: 'LM',
      MEDIUM_HIGH: 'MH',
      HIGH: 'H',
      NOT_DEFINED: 'ND',
    },
  ],
  [
    'targetDistribution',
    'TD',
    { NONE: 'N', LOW: 'L', MEDIUM: 'M', HIGH: 'H', NOT_DEFINED: 'ND' },
  ],
  [
    'confidentialityRequirement',
    'CR',
    { LOW: 'L', MEDIUM: 'M', HIGH: 'H', NOT_DEFINED: 'ND' },
  ],
  [
    'integrityRequirement',
    'IR',
    { LOW: 'L', MEDIUM: 'M', HIGH: 'H', NOT_DEFINED: 'ND' },
  ],
  [
    'availabilityRequirement',
    'AR',
    { LOW: 'L', MEDIUM: 'M', HIGH: 'H', NOT_DEFINED: 'ND' },
  ],
])

const cvss3Mapping = /** @type {const} */ ([
  // BASE SCORE
  [
    'attackVector',
    'AV',
    {
      NETWORK: 'N',
      ADJACENT_NETWORK: 'A',
      LOCAL: 'L',
      PHYSICAL: 'P',
    },
  ],
  [
    'attackComplexity',
    'AC',
    {
      HIGH: 'H',
      LOW: 'L',
    },
  ],
  [
    'privilegesRequired',
    'PR',
    {
      NONE: 'N',
      LOW: 'L',
      HIGH: 'H',
    },
  ],
  [
    'userInteraction',
    'UI',
    {
      NONE: 'N',
      REQUIRED: 'R',
    },
  ],
  [
    'scope',
    'S',
    {
      UNCHANGED: 'U',
      CHANGED: 'C',
    },
  ],
  [
    'confidentialityImpact',
    'C',
    {
      NONE: 'N',
      LOW: 'L',
      HIGH: 'H',
    },
  ],
  [
    'integrityImpact',
    'I',
    {
      NONE: 'N',
      LOW: 'L',
      HIGH: 'H',
    },
  ],
  [
    'availabilityImpact',
    'A',
    {
      NONE: 'N',
      LOW: 'L',
      HIGH: 'H',
    },
  ],

  // TEMPORAL SCORE
  [
    'exploitCodeMaturity',
    'E',
    {
      UNPROVEN: 'U',
      PROOF_OF_CONCEPT: 'P',
      FUNCTIONAL: 'F',
      HIGH: 'H',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'remediationLevel',
    'RL',
    {
      OFFICIAL_FIX: 'O',
      TEMPORARY_FIX: 'T',
      WORKAROUND: 'W',
      UNAVAILABLE: 'U',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'reportConfidence',
    'RC',
    {
      UNKNOWN: 'U',
      REASONABLE: 'R',
      CONFIRMED: 'C',
      NOT_DEFINED: 'X',
    },
  ],

  // ENVIRONMENTAL SCORE
  [
    'confidentialityRequirement',
    'CR',
    {
      LOW: 'L',
      MEDIUM: 'M',
      HIGH: 'H',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'integrityRequirement',
    'IR',
    {
      LOW: 'L',
      MEDIUM: 'M',
      HIGH: 'H',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'availabilityRequirement',
    'AR',
    {
      LOW: 'L',
      MEDIUM: 'M',
      HIGH: 'H',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedAttackVector',
    'MAV',
    {
      NETWORK: 'N',
      ADJACENT_NETWORK: 'A',
      LOCAL: 'L',
      PHYSICAL: 'P',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedAttackComplexity',
    'MAC',
    {
      HIGH: 'H',
      LOW: 'L',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedPrivilegesRequired',
    'MPR',
    {
      HIGH: 'H',
      LOW: 'L',
      NONE: 'N',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedUserInteraction',
    'MUI',
    {
      NONE: 'N',
      REQUIRED: 'R',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedScope',
    'MS',
    {
      UNCHANGED: 'U',
      CHANGED: 'C',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedConfidentialityImpact',
    'MC',
    {
      HIGH: 'H',
      LOW: 'L',
      NONE: 'N',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedIntegrityImpact',
    'MI',
    {
      HIGH: 'H',
      LOW: 'L',
      NONE: 'N',
      NOT_DEFINED: 'X',
    },
  ],
  [
    'modifiedAvailabilityImpact',
    'MA',
    {
      HIGH: 'H',
      LOW: 'L',
      NONE: 'N',
      NOT_DEFINED: 'X',
    },
  ],
])

/**
 * @param {object} params
 * @param {'2.0' | '3.0' | '3.1'} params.version
 * @param {Record<string, unknown>} params.metrics
 */
function calculateEnvironmentalScoreFromMetrics({ version, metrics }) {
  if (version === '3.1' || version === '3.0') {
    const args = /**
     * @type {[
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     *   string,
     * ]}
     */ (
      cvss3Mapping.map(
        (e) => /** @type {any} */ (e[2])[/** @type {any} */ (metrics[e[0]])]
      )
    )
    const score = (
      version === '3.1' ? cvss31 : cvss30
    ).calculateCVSSFromMetrics(...args)
    if (!score.success) return null
    return Number(score.environmentalMetricScore)
  } else {
    const vector = Object.fromEntries(
      cvss2Mapping.map((entry) => [
        entry[1],
        /** @type {any} */ (entry[2])[/** @type {any} */ (metrics)[entry[0]]],
      ])
    )
    const score = safelyParseCVSSV2Vector(vector)
    if (!score.success) return null
    return score.environmentalMetricScore
  }
}

/**
 * @param {string | {}} vectorString
 * @returns
 */
function safelyParseCVSSV2Vector(vectorString) {
  try {
    return {
      success: true,
      baseMetricScore: cvss2js.getBaseScore(vectorString),
      temporalMetricScore: cvss2js.getTemporalScore(vectorString),
      environmentalMetricScore: cvss2js.getEnvironmentalScore(vectorString),
    }
  } catch (e) {
    return {
      success: false,
      baseMetricScore: -1,
      temporalMetricScore: -1,
      environmentalMetricScore: -1,
    }
  }
}
