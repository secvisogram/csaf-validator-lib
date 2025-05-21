import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

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
                content: {
                  additionalProperties: true,
                  properties: {
                    ssvc_v1: {
                      additionalProperties: true,
                      properties: {
                        role: {
                          type: 'string',
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
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the optional test 6.2.37 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function optionalTest_6_2_37(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  /*
   * Please note that this list can change
   * */
  const registeredSsvcRoles = ['Supplier', 'Deployer', 'Coordinator']

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics.forEach((metric, metricIndex) => {
      const role = metric.content.ssvc_v1.role
      if (!registeredSsvcRoles.includes(role)) {
        context.warnings.push({
          message: `The  used role "${role}" is not a registered role`,
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/role`,
        })
      }
    })
  })

  return context
}
