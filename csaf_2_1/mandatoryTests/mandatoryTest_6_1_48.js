import Ajv from 'ajv/dist/jtd.js'
import ssvcDecisionPoints from '../../lib/ssvc/ssvc_decision_points.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
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
                    ssvc_v1: {
                      additionalProperties: true,
                      optionalProperties: {
                        id: { type: 'string' },
                        schemaVersion: { type: 'string' },
                        timestamp: { type: 'string' },
                        selections: {
                          elements: {
                            additionalProperties: true,
                            optionalProperties: {
                              name: { type: 'string' },
                              namespace: { type: 'string' },
                              values: {
                                elements: { type: 'string' },
                              },
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
 * This implements the mandatory test 6.1.48 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_48(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const registeredSsvcNamespaces = ['ssvc', 'cvss']
  // subset of all the valid decision points containing only the relevant properties
  const relevantSsvcDecisionPointsSubset =
    ssvcDecisionPoints.decisionPoints.map((dp) =>
      JSON.stringify({
        name: dp.name ?? '',
        namespace: dp.namespace ?? '',
        version: dp.version ?? '',
        values: dp.values ?? '',
      })
    )

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v1?.selections
      const selectionsWithRegisteredNamespace = selections?.filter(
        (s) =>
          s.namespace !== undefined &&
          registeredSsvcNamespaces.includes(s.namespace)
      )
      selectionsWithRegisteredNamespace?.forEach(
        (selection, selectionIndex) => {
          // check if a decision point with these properties exists
          const filteredDecisionPoints =
            relevantSsvcDecisionPointsSubset.filter((jsonDp) => {
              const dp = JSON.parse(jsonDp)
              return (
                dp.name === selection.name &&
                dp.namespace === selection.namespace &&
                dp.version === selection.version
              )
            })
          if (filteredDecisionPoints.length === 0) {
            ctx.isValid = false
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}`,
              message: `there exists no decision point with name ${selection.name} and version ${selection.version} in the namespace ${selection.namespace}`,
            })
          } else {
            // name, namespace and version define a unique decisionPoint, i.e. the array filteredDecisionPoints
            // can only have zero (catched in the previous if-statement) or one entry.
            // Therefore, it is sufficient to access the first and only entry in filteredDecisionPoints here
            if (
              selection.values &&
              !areValuesValidAndinOrder(
                JSON.parse(filteredDecisionPoints[0]).values.map(
                  (/** @type {{ name: string; }} */ value) => value.name
                ),
                selection.values
              )
            ) {
              ctx.isValid = false
              ctx.errors.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}`,
                message: `this decision point contains invalid values or its values are not in order`,
              })
            }
          }
        }
      )
    })
  })

  return ctx
}

/**
 * Check if the elements in the values array of the decision point are valid and if they are in the right order
 * according to the specification.
 * If values are missing, this is not an issue.
 *
 * @param {string[]} specifiedValues the valid elements of the values array of the respective decision point
 *                                   and their order according to the SSVC specification
 * @param {string[]} usedValues the actual used values of the decision point
 */
function areValuesValidAndinOrder(specifiedValues, usedValues) {
  //check if there is an invalid value used
  for (let i = 0; i < usedValues.length; i++) {
    const element = usedValues[i]
    if (!specifiedValues.includes(element)) {
      return false
    }
  }

  // check for the correct order
  for (let valueIndex = 0; valueIndex < usedValues.length; valueIndex++) {
    const value = usedValues[valueIndex]
    if (valueIndex === 0) {
      continue
    }
    const specifiedIndexCurrentElement = specifiedValues.indexOf(value)
    const previousValue = usedValues[valueIndex - 1]
    const specifiedIndexPreviousElement = specifiedValues.indexOf(previousValue)

    if (specifiedIndexCurrentElement < specifiedIndexPreviousElement) {
      return false
    }
  }
  return true
}
