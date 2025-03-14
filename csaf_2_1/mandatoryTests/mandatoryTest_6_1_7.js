import Ajv from 'ajv/dist/jtd.js'

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
  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    /** @type {Map<string, Set<string>>} */
    const cvssVersionsByProductName = new Map()

    /** @type {Array<any>} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      /** @type {Array<any>} */
      const products = metric.products
      products?.forEach((product, productIndex) => {
        const versionSet = cvssVersionsByProductName.get(product) ?? new Set()
        cvssVersionsByProductName.set(product, versionSet)

        if (
          (metric.content?.cvss_v2?.version !== undefined &&
            versionSet.has(metric.content?.cvss_v2.version)) ||
          (metric.content?.cvss_v3?.version !== undefined &&
            versionSet.has(metric.content?.cvss_v3.version)) ||
          (metric.content?.cvss_v4?.version !== undefined &&
            versionSet.has(metric.content?.cvss_v4.version))
        ) {
          isValid = false
          errors.push({
            message: `product is already included in these cvss-versions: ${Array.from(
              versionSet.keys()
            ).join(', ')}`,
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/products/${productIndex}`,
          })
        }
        if (metric.content?.cvss_v2?.version !== undefined) {
          versionSet.add(metric.content?.cvss_v2.version)
        }
        if (metric.content?.cvss_v3?.version !== undefined) {
          versionSet.add(metric.content?.cvss_v3.version)
        }
        if (metric.content?.cvss_v4?.version !== undefined) {
          versionSet.add(metric.content?.cvss_v4.version)
        }
      })
    })
  })

  return { errors, isValid }
}
