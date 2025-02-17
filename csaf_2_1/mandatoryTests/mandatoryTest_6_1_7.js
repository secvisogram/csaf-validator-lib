/**
 *
 * @param {unknown} doc
 */
export default function mandatoryTest_6_1_7(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  // 6.1.7 Multiple Scores with same Version per Product
  if (preconditionFor_6_1_7_Matches(doc)) {
    doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
      /** @type {Map<string, Set<string>>} */
      const cvssVersionsByProductName = new Map()

      vulnerability.metrics?.forEach((metric, scoreIndex) => {
        metric.products?.forEach((product, productIndex) => {
          const versionSet = cvssVersionsByProductName.get(product) ?? new Set()
          cvssVersionsByProductName.set(product, versionSet)

          if (
            (metric.content?.cvss_v2?.version !== undefined &&
              versionSet.has(metric.content?.cvss_v2.version)) ||
            (metric.content?.cvss_v3?.version !== undefined &&
              versionSet.has(metric.content?.cvss_v3.version))||
              (metric.content?.cvss_v4?.version !== undefined &&
                  versionSet.has(metric.content?.cvss_v4.version))
          ) {
            isValid = false
            errors.push({
              message: `product is already included in these cvss-versions: ${Array.from(
                versionSet.keys()
              ).join(', ')}`,
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${scoreIndex}/products/${productIndex}`,
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
  }

  return { errors, isValid }
}

/**
 * @param {unknown} rawDoc
 * @returns {rawDoc is {
 *    vulnerabilities: Array<{
 *      metrics?: Array<{
 *        products?: string[]
 *        content?: {
 *          cvss_v3?: { version?: string }
 *          cvss_v2?: { version?: string }
 *          cvss_v4?: { version?: string }
 *          }
 *      }>
 *    }>
 *  }}
 */
const preconditionFor_6_1_7_Matches = (rawDoc) => {
  if (typeof rawDoc !== 'object' || !rawDoc) return false
  /** @type {{ vulnerabilities?: unknown }} */
  const doc = rawDoc
  return (
    Array.isArray(doc.vulnerabilities) &&
    doc.vulnerabilities.every(
      (vulnerability) =>
        (Array.isArray(vulnerability.metrics) &&
          vulnerability.metrics.every(
            (
              /** @type {{ products?: unknown; content?: {cvss_v2?: any; cvss_v3?: any; cvss_v4?: any }}} */ metric
            ) =>
              Array.isArray(metric.products) &&
              metric.products.every((product) => typeof product === 'string') &&
              ((metric.content?.cvss_v2 &&
                (typeof metric.content?.cvss_v2.version === 'string' ||
                  metric.content?.cvss_v2.version === undefined)) ||
                metric.content?.cvss_v2 === undefined) &&
              ((metric.content?.cvss_v3 &&
                (typeof metric.content?.cvss_v3.version === 'string' ||
                  metric.content?.cvss_v3.version === undefined)) ||
                metric.content?.cvss_v3 === undefined) &&
                ((metric.content?.cvss_v4 &&
                        (typeof metric.content?.cvss_v4.version === 'string' ||
                            metric.content?.cvss_v4.version === undefined)) ||
                    metric.content?.cvss_v4 === undefined)
          )) ||
        vulnerability.metrics === undefined
    )
  )
}
