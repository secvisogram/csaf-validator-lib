import { Ajv } from 'ajv/dist/jtd.js'
import semver from 'semver'
import ssvcDecisionPoints from '../../lib/ssvc/ssvc_decision_points.js'
import {
  getSsvcBaseNamespace,
  isRegisteredSsvcNamespace,
} from '../shared/ssvcNamespaces.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
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
                              key: { type: 'string' },
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

const validate = ajv.compile(inputSchema)

/**
 * Finds the latest known version of a decision point of a registered namespace.
 *
 * @param {{ key: string; namespace: string }} selection
 * @returns {string | undefined}
 */
function findLatestVersion(selection) {
  const baseNamespace = getSsvcBaseNamespace(selection.namespace)
  const versions = ssvcDecisionPoints.decisionPoints
    .filter((p) => p.namespace === baseNamespace && p.key === selection.key)
    .map((p) => p.version)
  return semver.rsort(versions)[0]
}

/**
 * This implements the informative test 6.3.25 of the CSAF 2.1 standard.
 *
 * For each SSVC selection with a registered namespace, it checks whether the
 * version is the latest known one and reports an info if it is not.
 *
 * @param {unknown} doc
 */
export async function informativeTest_6_3_25(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      metric.content?.ssvc_v2?.selections?.forEach((selection, index) => {
        const { namespace, version } = selection
        if (
          namespace === undefined ||
          version === undefined ||
          selection.key === undefined ||
          !isRegisteredSsvcNamespace(namespace)
        ) {
          return
        }
        const latest = findLatestVersion({ key: selection.key, namespace })
        if (
          latest !== undefined &&
          semver.valid(version) &&
          semver.lt(version, latest)
        ) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v2/selections/${index}`,
            message: `version ${version} of the decision point ${selection.key} is not the latest version available (${latest})`,
          })
        }
      })
    })
  })

  return ctx
}
