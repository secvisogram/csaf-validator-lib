import Ajv from 'ajv/dist/jtd.js'

/**
 * @typedef {{ cvss_v2: {version: string}, cvss_v3: {version: string}, cvss_v4: {version: string}}} MetricContent
 */

/**
 * @typedef {Object} Metric
 * @property {MetricContent} content
 */

const jtdAjv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        properties: {
          metrics: {
            elements: {
              additionalProperties: true,
              properties: {
                products: {
                  elements: {},
                },
              },
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v2: {
                      additionalProperties: true,
                      properties: {
                        version: { type: 'string' },
                      },
                    },
                    cvss_v3: {
                      additionalProperties: true,
                      properties: {
                        version: { type: 'string' },
                      },
                    },
                    cvss_v4: {
                      additionalProperties: true,
                      properties: {
                        version: { type: 'string' },
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

const validate = jtdAjv.compile(inputSchema)

/**
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_7(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validate(doc)) {
    return ctx
  }

  // 6.1.7 Multiple Scores with same Version per Product
  /** @type {Array<any>} */
  const vulnerabilities = doc.vulnerabilities

  /**
   * @param {string} version
   * @param {string} source
   */
  function hashVersionSource(version, source) {
    return JSON.stringify({ version: version, source: source })
  }

  /**
   *
   * @param  {Metric}  metric
   * @param {string}  version
   * @param {string}  source
   * @returns {string|null}
   */
  function getSameVersionInMetric(metric, version, source) {
    if (
      metric.content?.cvss_v2?.version !== undefined &&
      version === hashVersionSource(metric.content?.cvss_v2.version, source)
    ) {
      return metric.content?.cvss_v2?.version
    } else if (
      metric.content?.cvss_v3?.version !== undefined &&
      version === hashVersionSource(metric.content?.cvss_v3.version, source)
    ) {
      return metric.content?.cvss_v3?.version
    } else if (
      metric.content?.cvss_v4?.version !== undefined &&
      version === hashVersionSource(metric.content?.cvss_v4.version, source)
    ) {
      return metric.content?.cvss_v4?.version
    } else {
      return null
    }
  }

  /**
   * @param {Metric} metric
   * @param {Set<string>} versionSet
   * @param {string}  source
   */
  function addVersionsInMetricToSet(metric, versionSet, source) {
    if (metric.content?.cvss_v2?.version !== undefined) {
      versionSet.add(hashVersionSource(metric.content?.cvss_v2.version, source))
    }
    if (metric.content?.cvss_v3?.version !== undefined) {
      versionSet.add(hashVersionSource(metric.content?.cvss_v3.version, source))
    }
    if (metric.content?.cvss_v4?.version !== undefined) {
      versionSet.add(hashVersionSource(metric.content?.cvss_v4.version, source))
    }
  }

  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    /** @type {Map<string, Set<string>>} */
    const cvssVersionsByProductName = new Map()

    /** @type {Array<any>} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      /** @type {Array<any>} */
      const products = metric.products
      const source = metric.source ? metric.source : ''
      products?.forEach((product, productIndex) => {
        const versionSet = cvssVersionsByProductName.get(product) ?? new Set()
        cvssVersionsByProductName.set(product, versionSet)

        versionSet.forEach((version) => {
          const sameVersion = getSameVersionInMetric(metric, version, source)
          if (sameVersion) {
            isValid = false

            errors.push({
              message: `Product is member of more than one CVSS-Vectors with the same version '${sameVersion}' and same source ${source}.`,
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/products/${productIndex}`,
            })
          }
        })

        addVersionsInMetricToSet(metric, versionSet, source)
      })
    })
  })

  return { errors, isValid }
}
