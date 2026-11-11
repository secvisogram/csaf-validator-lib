import { Ajv } from 'ajv/dist/jtd.js'
import { cvss30, cvss31 } from '../shared/first.js'
import * as cvss2 from '../shared/cvss2.js'
import * as cvss3 from '../shared/cvss3.js'

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

// Turning the products of a score into a Set costs about as much as 30
// searches in that list, so it is only done for vulnerabilities with at least
// this many fixed products.
const MIN_FIXED_PRODUCTS_FOR_SET = 32

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
    const fixedProductIDs = new Set([
      ...(vulnerability.product_status?.first_fixed ?? []),
      ...(vulnerability.product_status?.fixed ?? []),
    ])
    // The products of a score and the outcome of its CVSS checks are the same
    // for every fixed product, so both are determined once per score.
    const useSets = fixedProductIDs.size >= MIN_FIXED_PRODUCTS_FOR_SET
    /** @type {Array<{ productIDs?: Set<string>; cvssKeys?: Array<'cvss_v3' | 'cvss_v2'> }>} */
    const scoreInfos = []
    for (const productID of fixedProductIDs) {
      vulnerability.scores?.forEach((score, scoreIndex) => {
        const scoreInfo = (scoreInfos[scoreIndex] ??= useSets
          ? { productIDs: new Set(score.products) }
          : {})
        const isListed = scoreInfo.productIDs
          ? scoreInfo.productIDs.has(productID)
          : score.products?.includes(productID)
        if (!isListed) return
        scoreInfo.cvssKeys ??= getCvssKeysToReport(score)
        for (const cvssKey of scoreInfo.cvssKeys) {
          ctx.warnings.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${scoreIndex}/${cvssKey}`,
            message: `environmental score should be 0 since "${productID}" is listed as fixed`,
          })
        }
      })
    }
  })

  return ctx
}

/**
 * Returns the CVSS properties of a score whose environmental score (given or
 * calculated) is not 0, in the order in which they are reported.
 *
 * @param {any} score
 */
function getCvssKeysToReport(score) {
  /** @type {Array<'cvss_v3' | 'cvss_v2'>} */
  const cvssKeys = []
  if (score.cvss_v3) {
    const calculatedValue =
      score.cvss_v3.version === '3.1' || score.cvss_v3.version === '3.0'
        ? calculateEnvironmentalScoreFromMetrics({
            version: score.cvss_v3.version,
            vectorString: score.cvss_v3.vectorString ?? '',
            metrics: score.cvss_v3,
          })
        : null
    if (
      (typeof score.cvss_v3.environmentalScore === 'number' &&
        score.cvss_v3.environmentalScore > 0) ||
      (typeof calculatedValue === 'number' && calculatedValue > 0) ||
      calculatedValue === null
    ) {
      cvssKeys.push('cvss_v3')
    }
  }
  if (score.cvss_v2) {
    const calculatedValue = calculateEnvironmentalScoreFromMetrics({
      version: '2.0',
      vectorString: score.cvss_v2.vectorString ?? '',
      metrics: score.cvss_v2,
    })
    if (
      (typeof score.cvss_v2.environmentalScore === 'number' &&
        score.cvss_v2.environmentalScore > 0) ||
      (typeof calculatedValue === 'number' && calculatedValue !== 0) ||
      calculatedValue === null
    ) {
      cvssKeys.push('cvss_v2')
    }
  }
  return cvssKeys
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

/**
 * @param {object} params
 * @param {'2.0' | '3.0' | '3.1'} params.version
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
      calculateMetricArray({
        mapping: cvss3Mapping,
        metrics,
        vector: vectorFromVectorString,
      }).map((e) => e[1])
    )
    const score = (
      version === '3.1' ? cvss31 : cvss30
    ).calculateCVSSFromMetrics(...args)
    if (!score.success) return null
    return Number(score.environmentalMetricScore)
  } else {
    const vector = Object.fromEntries(
      calculateMetricArray({
        mapping: cvss2Mapping,
        metrics,
        vector: vectorFromVectorString,
      })
    )
    const score = safelyParseCVSSV2Vector(vector)
    if (!score.success) return null
    return score.environmentalMetricScore
  }
}

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
