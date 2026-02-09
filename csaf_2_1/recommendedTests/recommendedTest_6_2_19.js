import Ajv from 'ajv/dist/jtd.js'
import { cvss30, cvss31 } from '../../lib/shared/first.js'
import * as cvss2 from '../../lib/shared/cvss2.js'
import * as cvss3 from '../../lib/shared/cvss3.js'
import * as cvss4 from '../../lib/shared/cvss4.js'

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
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v4: {
                      additionalProperties: true,
                      optionalProperties: {
                        environmentalScore: { type: 'float64' },
                        vectorString: { type: 'string' },
                        version: { type: 'string' },
                      },
                    },
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
export function recommendedTest_6_2_19(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    const fixedProductIDs = new Set([
      ...(vulnerability.product_status?.first_fixed ?? []),
      ...(vulnerability.product_status?.fixed ?? []),
    ])
    for (const productID of fixedProductIDs) {
      vulnerability.metrics?.forEach((metric, metricIndex) => {
        if (!metric.products?.includes(productID)) return
        const content = metric.content
        if (content !== undefined) {
          const cvssTypes = ['cvss_v4', 'cvss_v3', 'cvss_v2']
          cvssTypes.forEach((cvssType) => {
            if (content[cvssType] && checkCVSS(content[cvssType])) {
              ctx.warnings.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/${cvssType}`,
                message: `environmental score should be 0 since "${productID}" is listed as fixed`,
              })
            }
          })
        }
      })
    }
  })

  return ctx
}

/**
 * Check if the cvss object has a valid environmental score.
 * @param {any} cvss
 * @returns {boolean}
 */
function checkCVSS(cvss) {
  if (!cvss) return false
  const calculatedValue = calculateEnvironmentalScoreFromMetrics({
    version: cvss.version,
    vectorString: cvss.vectorString ?? '',
    metrics: cvss,
  })
  return (
    (typeof cvss.environmentalScore === 'number' &&
      cvss.environmentalScore > 0) ||
    (typeof calculatedValue === 'number' && calculatedValue > 0) ||
    calculatedValue === null
  )
}

/**
 * @param {object} params
 * @param {'2.0' | '3.0' | '3.1' | '4.0'} params.version
 * @param {string} params.vectorString
 * @param {Record<string, unknown>} params.metrics
 */
function calculateEnvironmentalScoreFromMetrics({
  version,
  vectorString,
  metrics,
}) {
  const vectorFromVectorString = new Map(
    vectorString
      .split('/')
      .map((e) => {
        const [key, value] = e.split(':')
        return /** @type {const} */ ([key, value])
      })
      .filter(([, value]) => value)
  )

  if (version === '4.0') {
    return calculateMetricScoreForCVSS4(
      vectorString,
      metrics,
      vectorFromVectorString
    )
  } else if (version === '3.1' || version === '3.0') {
    return calculateMetricScoreForCVSS3(
      vectorFromVectorString,
      metrics,
      version
    )
  } else {
    return calculateMetricScoreForCVSS2(vectorFromVectorString, metrics)
  }
}

/**
 * @param {string} vectorString
 * @param {Record<string, unknown>} metrics
 * @param {Map<string, string>} vectorFromVectorString
 */
function calculateMetricScoreForCVSS4(
  vectorString,
  metrics,
  vectorFromVectorString
) {
  // Extract all metrics from the metrics object and combine with vector string
  const metricArray = calculateMetricArray({
    mapping: cvss4Mapping,
    metrics,
    vector: vectorFromVectorString,
  })

  // Build complete vector string with all metrics including Modified ones
  const completeVectorParts = metricArray
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}:${value}`)

  // Keep CVSS version prefix from original vector
  const versionPrefix = vectorString.split('/')[0]
  const completeVectorString = [versionPrefix, ...completeVectorParts].join('/')

  const calculateScoreObject =
    cvss4.calculateCvss4_0_Score(completeVectorString)
  const environmentalScoreObject = calculateScoreObject.find(
    (scoreObject) => scoreObject.metricTypeId === 'ENVIRONMENTAL'
  )
  return environmentalScoreObject?.score ?? null
}

/**
 * This function takes a cvss vector and a metric object and extracts all cvss
 * @param {Map<string, string>} vectorFromVectorString
 * @param {Record<string, unknown>} metrics
 * @param {'3.0' | '3.1'} version
 * @returns {number|null}
 */
function calculateMetricScoreForCVSS3(
  vectorFromVectorString,
  metrics,
  version
) {
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
    calculateMetricArray({
      mapping: cvss3Mapping,
      metrics,
      vector: vectorFromVectorString,
    }).map((e) => e[1])
  )
  const metric = (version === '3.1' ? cvss31 : cvss30).calculateCVSSFromMetrics(
    ...args
  )
  if (!metric.success) return null
  return Number(metric.environmentalMetricScore)
}

/**
 * This function takes a cvss vector and a metric object and extracts all cvss
 * @param {Map<string, string>} vectorFromVectorString
 * @param {Record<string, unknown>} metrics
 * @returns {number|*|null}
 */
function calculateMetricScoreForCVSS2(vectorFromVectorString, metrics) {
  const vector = Object.fromEntries(
    calculateMetricArray({
      mapping: cvss2Mapping,
      metrics,
      vector: vectorFromVectorString,
    })
  )
  const metric = safelyParseCVSSV2Vector(vector)
  if (!metric.success) return null
  return metric.environmentalMetricScore
}

const cvss2Mapping =
  /** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */ (
    cvss2.mapping.map((mapping) => [
      mapping[0],
      mapping[1],
      Object.fromEntries(
        Object.entries(mapping[2]).map(([key, value]) => [key, value.id])
      ),
    ])
  )

const cvss3Mapping = cvss3.mapping

const cvss4Mapping =
  /** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */ (
    cvss4.flatMetrics.map((metric) => [
      metric.jsonName,
      metric.metricShort,
      Object.fromEntries(
        metric.options.map((option) => [option.optionValue, option.optionKey])
      ),
    ])
  )

/**
 * This function takes a cvss vector and a metric object and extracts all cvss
 * values according to the mapping. It does this by first looking up every property
 * in the `vector`. If the property doesn't exist there but in the metrics objects,
 * it takes the value from the corresponding metrics object.
 *
 * @param {object} params
 * @param {Map<string, string>} params.vector
 * @param {Record<string, unknown>} params.metrics
 * @param {ReadonlyArray<readonly [string, string, Record<string, string>]>} params.mapping
 * @returns an array of pairs where the first element is the metric name (abbreviated) and the
 *    second is the value (abbreviated). If no value is found the value is `undefined`.
 *    The order of the array is the same as in the mapping.
 */
function calculateMetricArray({ vector, metrics, mapping }) {
  return mapping.map((e) => {
    const metricAbbrev = e[1]
    const metricPropertyName = e[0]
    /** @type {any} */
    const metricValueAbbrevMap = e[2]
    /** @type {any} */
    const metricValue = metrics[metricPropertyName]
    return [
      metricAbbrev,
      vector.get(metricAbbrev) ?? metricValueAbbrevMap[metricValue],
    ]
  })
}

/**
 * @param {string | {}} vectorString
 * @returns
 */
function safelyParseCVSSV2Vector(vectorString) {
  try {
    return {
      success: true,
      environmentalMetricScore:
        cvss2.getEnvironmentalScoreFromVectorString(vectorString),
    }
  } catch (e) {
    return {
      success: false,
      environmentalMetricScore: -1,
    }
  }
}
