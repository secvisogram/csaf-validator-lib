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
                      properties: {},
                    },
                    cvss_v3: {
                      additionalProperties: true,
                      properties: {},
                    },
                    cvss_v4: {
                      additionalProperties: true,
                      properties: {},
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

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      if (
        metric.content?.cvss_v2 &&
        !metric.content?.cvss_v3 &&
        !metric.content?.cvss_v4
      ) {
        ctx.infos.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}`,
          message: 'use of cvss v2 as the only scoring system',
        })
      }
    })
  })

  return ctx
}
