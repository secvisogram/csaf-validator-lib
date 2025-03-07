import * as cvss2 from '../../lib/shared/cvss2.js'
import * as cvss3 from '../../lib/shared/cvss3.js'

const cvssV3VectorStringMapping = cvss3.mapping

/** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */
const cvssV2VectorStringMapping =
  /** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */ (
    cvss2.mapping.map((mapping) => [
      mapping[0],
      mapping[1],
      Object.fromEntries(
        Object.entries(mapping[2]).map(([key, value]) => [key, value.id])
      ),
    ])
  )

/** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */
const cvssV4VectorStringMapping =
  /** @type {ReadonlyArray<readonly [string, string, Record<string, string>]>} */ (
    cvss2.mapping.map((mapping) => [
      mapping[0],
      mapping[1],
      Object.fromEntries(
        Object.entries(mapping[2]).map(([key, value]) => [key, value.id])
      ),
    ])
  )

/**
 * @param {any} doc
 */
export function mandatoryTest_6_1_10(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (Array.isArray(doc.vulnerabilities)) {
    /** @type {Array<any>} */
    const vulnerabilities = doc.vulnerabilities
    vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
      if (!Array.isArray(vulnerability.metrics)) return
      /** @type {Array<any>} */
      const metrics = vulnerability.metrics
      metrics.forEach((metric, metricIndex) => {
        if (typeof metric.content?.cvss_v2?.vectorString === 'string') {
          /** @type {Record<string, unknown>} */
          const cvssV2 = metric.content.cvss_v2
          const vectorString = /** @type {string} */ (cvssV2.vectorString)

          validateCVSSAttributes({
            vectorValues: vectorString.split('/'),
            vectorMapping: cvssV2VectorStringMapping,
            cvss: cvssV2,
            onError({ attributeKey }) {
              isValid = false
              errors.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${metricIndex}/cvss_v2/${attributeKey}`,
                message: 'value is not consistent with the vector string',
              })
            },
          })
        }

        if (
          typeof metric.content.cvss_v3?.vectorString === 'string' &&
          (metric.content.cvss_v3.version === '3.1' ||
            metric.content.cvss_v3.version === '3.0')
        ) {
          /** @type {Record<string, unknown>} */
          const cvssV3 = metric.content.cvss_v3
          const vectorString = /** @type {string} */ (cvssV3.vectorString)

          validateCVSSAttributes({
            vectorValues: vectorString.split('/').slice(1),
            vectorMapping: cvssV3VectorStringMapping,
            cvss: cvssV3,
            onError({ attributeKey }) {
              isValid = false
              errors.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${metricIndex}/cvss_v3/${attributeKey}`,
                message: 'value is not consistent with the vector string',
              })
            },
          })
        }

        if (typeof metric.content.cvss_v4?.vectorString === 'string') {
          /** @type {Record<string, unknown>} */
          const cvssV4 = metric.content.cvss_v4
          const vectorString = /** @type {string} */ (cvssV4.vectorString)

          validateCVSSAttributes({
            vectorValues: vectorString.split('/').slice(1),
            vectorMapping: cvssV4VectorStringMapping,
            cvss: cvssV4,
            onError({ attributeKey }) {
              isValid = false
              errors.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/scores/${metricIndex}/cvss_v4/${attributeKey}`,
                message: 'value is not consistent with the vector string',
              })
            },
          })
        }
      })
    })
  }

  return { errors, isValid }
}

/**
 * @param {object} params
 * @param {string[]} params.vectorValues
 * @param {ReadonlyArray<readonly [string, string, { [key: string]: string }]>} params.vectorMapping
 * @param {Record<string, unknown>} params.cvss
 * @param {(params: { attributeKey: string }) => void} params.onError
 */
function validateCVSSAttributes({
  vectorValues,
  vectorMapping,
  cvss,
  onError,
}) {
  vectorValues.forEach((str) => {
    const [key, value] = str.split(':')
    const entry = vectorMapping.find((e) => e[1] === key)
    if (!entry) return
    const [attributeKey] = entry

    const attributeValue = cvss[attributeKey]
    if (typeof attributeValue !== 'string') return

    const expectedAttributeValue = Object.entries(entry[2]).find(
      (e) => e[1] === value
    )?.[0]
    if (typeof expectedAttributeValue !== 'string') return

    if (attributeValue !== expectedAttributeValue) {
      onError({ attributeKey })
    }
  })
}
