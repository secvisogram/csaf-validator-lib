import Ajv from 'ajv/dist/jtd.js'
import decision_points from '../../lib/cvss/decision_points.js'

const ajv = new Ajv()

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */

/** @typedef {InputSchema['vulnerabilities'][number]} Vulnerability */

/** @typedef {NonNullable<Vulnerability['metrics']>[number]} Metric */

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
                    ssvc_v2: {
                      additionalProperties: true,
                      optionalProperties: {
                        selections: {
                          elements: {
                            additionalProperties: true,
                            optionalProperties: {
                              name: { type: 'string' },
                              namespace: { type: 'string' },
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
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * For each SSVC decision point given under `selections` with a registered
 * `namespace`, it MUST be tested the latest decision point
 * `version` available at the time of the `timestamp` was used.
 * The test SHALL fail if a later `version` was used.
 * Namespaces reserved for special purpose MUST be treated as per their
 * definition.
 *
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_13(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const decisionPointName2Version = new Map()
  decision_points.decisionPoints.forEach((obj) => {
    const currentVersion = decisionPointName2Version.get(obj.name)
    if (!currentVersion || currentVersion < obj.version) {
      decisionPointName2Version.set(obj.name, obj.version)
    }
  })

  const vulnerabilities = doc.vulnerabilities

  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    /** @type {Array<Metric> | undefined} */
    const metrics = vulnerability.metrics
    metrics?.forEach((metric, metricIndex) => {
      const selections = metric?.content?.ssvc_v2?.selections
      selections?.forEach((selection, selectionIndex) => {
        const latestVersion = decisionPointName2Version.get(selection?.name)
        if (
          selection.version !== latestVersion &&
          selection.namespace === 'ssvc'
        ) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}/version`,
            message: `ssvc_v1 version '${selection.version}' is not latest decision point version '${latestVersion}'`,
          })
        }
      })
    })
  })

  return ctx
}
