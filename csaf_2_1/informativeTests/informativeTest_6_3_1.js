import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/**
 * @typedef {{ cvss_v2: {version: string}, cvss_v3: {version: string}, cvss_v4: {version: string}}} MetricContent
 */

/**
 * @typedef {Object} Metric
 * @property {MetricContent} content
 * @property {Array<string>} products
 */

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

const validateInput = ajv.compile(inputSchema)

/**
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_1(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  /**
   * @param {Metric} metric
   * @param {Set<string>} versionSet
   */
  function addVersionsInMetricToSet(metric, versionSet) {
    if (metric.content?.cvss_v2?.version !== undefined) {
      versionSet.add(metric.content?.cvss_v2.version)
    }
    if (metric.content?.cvss_v3?.version !== undefined) {
      versionSet.add(metric.content?.cvss_v3.version)
    }
    if (metric.content?.cvss_v4?.version !== undefined) {
      versionSet.add(metric.content?.cvss_v4.version)
    }
  }

  /** @type {Array<any>} */
  const vulnerabilities = doc.vulnerabilities

  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    /** @type {Map<string, Set<string>>} */
    const cvssVersionsByProduct = new Map()
    const metricIndexByProduct = new Map()
    /** @type {Array<any>} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      /** @type {Array<any>} */
      const products = metric.products
      products.forEach((product) => {
        const versionSet = cvssVersionsByProduct.get(product) ?? new Set()
        cvssVersionsByProduct.set(product, versionSet)
        metricIndexByProduct.set(product, metricIndex)
        addVersionsInMetricToSet(metric, versionSet)
      })
    })
    cvssVersionsByProduct.forEach((value, product) => {
      if (value.size === 1 && value.values().next().value === '2.0') {
        const metricIndex = metricIndexByProduct.get(product)
        ctx.infos.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}`,
          message: `use of cvss v2 as the only scoring system for product ${product}`,
        })
      }
    })
  })

  return ctx
}
