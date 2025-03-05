import cvss2js from 'cvss2js'
import { getEnvironmentalScoreFromVectorString } from '../../lib/shared/cvss2.js'
import { cvss30 as CVSS, cvss31 as CVSS31 } from '../../lib/shared/first.js'
import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {},
        optionalProperties: {
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v2: {
                      additionalProperties: true,
                      optionalProperties: {
                        vectorString: { type: 'string' },
                        baseScore: { type: 'float64' },
                        temporalScore: { type: 'float64' },
                        environmentalScore: { type: 'float64' },
                      },
                    },
                    cvss_v3: {
                      additionalProperties: true,
                      optionalProperties: {
                        vectorString: { type: 'string' },
                        version: { type: 'string' },
                        baseScore: { type: 'float64' },
                        baseSeverity: { type: 'string' },
                        temporalScore: { type: 'float64' },
                        temporalSeverity: { type: 'string' },
                        environmentalScore: { type: 'float64' },
                        environmentalSeverity: { type: 'string' },
                      },
                    },
                  },
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
export function mandatoryTest_6_1_9(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validateInput(doc)) {
    return { errors, isValid }
  }

  const vulnerabilities = doc.vulnerabilities
  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const scores = vulnerability.metrics
    scores?.forEach((score, scoreIndex) => {
      if (
        score.content?.cvss_v2 &&
        typeof score.content.cvss_v2.vectorString === 'string'
      ) {
        const cvssV2 = score.content.cvss_v2
        const result = safelyParseCVSSV2Vector(
          score.content.cvss_v2.vectorString
        )

        if (result.success) {
          for (const { score, expectedScore, name } of [
            {
              score: cvssV2.baseScore,
              expectedScore: result.baseMetricScore,
              name: 'baseScore',
            },
            {
              score: cvssV2.temporalScore,
              expectedScore: result.temporalMetricScore,
              name: 'temporalScore',
            },
            {
              score: cvssV2.environmentalScore,
              expectedScore: result.environmentalMetricScore,
              name: 'environmentalScore',
            },
          ]) {
            if (typeof score === 'number') {
              if (score !== Number(expectedScore)) {
                isValid = false
                errors.push({
                  instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/cvss_v2/${name}`,
                  message: 'invalid calculated value',
                })
              }
            }
          }
        }
      }

      if (
        score.content?.cvss_v3 &&
        typeof score.content.cvss_v3.vectorString === 'string' &&
        (score.content.cvss_v3.version === '3.1' ||
          score.content.cvss_v3.version === '3.0')
      ) {
        const calculator =
          score.content.cvss_v3.version === '3.0' ? CVSS : CVSS31
        const result = calculator.calculateCVSSFromVector(
          score.content.cvss_v3.vectorString
        )

        if (result.success) {
          for (const { score: scoreValue, expectedScore, name } of [
            {
              score: score.content.cvss_v3.baseScore,
              expectedScore: result.baseMetricScore,
              name: 'baseScore',
            },
            {
              score: score.content.cvss_v3.temporalScore,
              expectedScore: result.temporalMetricScore,
              name: 'temporalScore',
            },
            {
              score: score.content.cvss_v3.environmentalScore,
              expectedScore: result.environmentalMetricScore,
              name: 'environmentalScore',
            },
          ]) {
            if (typeof scoreValue === 'number') {
              if (scoreValue !== Number(expectedScore)) {
                isValid = false
                errors.push({
                  instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/cvss_v3/${name}`,
                  message: 'invalid calculated value',
                })
              }
            }
          }

          for (const { severity, expectedSeverity, name } of [
            {
              severity: score.content.cvss_v3.baseSeverity,
              expectedSeverity: result.baseSeverity,
              name: 'baseSeverity',
            },
            {
              severity: score.content.cvss_v3.temporalSeverity,
              expectedSeverity: result.temporalSeverity,
              name: 'temporalSeverity',
            },
            {
              severity: score.content.cvss_v3.environmentalSeverity,
              expectedSeverity: result.environmentalSeverity,
              name: 'environmentalSeverity',
            },
          ]) {
            if (typeof severity === 'string') {
              if (severity !== expectedSeverity.toUpperCase()) {
                isValid = false
                errors.push({
                  instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/cvss_v3/${name}`,
                  message: 'invalid calculated value',
                })
              }
            }
          }
        }
      }
    })
  })

  return { errors, isValid }
}

/**
 * @param {string} vectorString
 * @returns
 */
function safelyParseCVSSV2Vector(vectorString) {
  try {
    return {
      success: true,
      baseMetricScore: cvss2js.getBaseScore(vectorString),
      temporalMetricScore: cvss2js.getTemporalScore(vectorString),
      environmentalMetricScore:
        getEnvironmentalScoreFromVectorString(vectorString),
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
