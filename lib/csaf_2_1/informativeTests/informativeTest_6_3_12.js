import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v4: {
                      additionalProperties: true,
                      properties: {},
                    }
                  }
                }
              }
            }
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
export default async function informativeTest_6_3_12(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability?.metrics?.forEach((metric, metricIndex) => {
      if (!metric?.content?.cvss_v4) {
        ctx.infos.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content`,
          message: 'There is no CVSS v4.0 score given',
        })
      }
    })
  })

  return ctx
}
