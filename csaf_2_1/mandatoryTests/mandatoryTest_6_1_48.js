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
 * @param {string | undefined} name
 * @param {string | undefined} namespace
 * @param {string | undefined} version
 */
function decisionPointHash(name, namespace, version) {
  return JSON.stringify({
    name: name ?? '',
    namespace: namespace ?? '',
    version: version ?? '',
  })
}

/** @type {Map<string,{ name: string; namespace: string; version: string; key?: string; values: { key: string; name: string; description: string; }[]; }>} */
const decisionPointMap = new Map(
  ssvcDecisionPoints.decisionPoints.map((obj) => [
    decisionPointHash(obj.name, obj.namespace, obj.version),
    obj,
  ])
)

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

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.metrics?.forEach((metric, metricIndex) => {
      const selections = metric.content?.ssvc_v1?.selections
      const selectionsWithRegisteredNamespace = selections?.filter(
        (s) =>
          s.namespace !== undefined &&
          registeredSsvcNamespaces.includes(s.namespace)
      )
      selectionsWithRegisteredNamespace?.forEach((select, selectionIndex) => {
        // check if a decision point with these properties exists
        const selectedDecisionPnt = decisionPointMap.get(
          decisionPointHash(select.name, select.namespace, select.version)
        )

        if (!selectedDecisionPnt) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}`,
            message: `there exists no decision point with name ${select.name} and version ${select.version} in the namespace ${select.namespace}`,
          })
        } else {
          if (
            select.values &&
            !areValuesValidAndinOrder(selectedDecisionPnt.values, select.values)
          ) {
            ctx.isValid = false
            ctx.errors.push({
              instancePath: `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/ssvc_v1/selections/${selectionIndex}`,
              message: `this decision point contains invalid values or its values are not in order`,
            })
          }
        }
      })
    })
  })

  return ctx
}

/**
 * Check if the elements in the values array of the decision point are valid and if they are in the right order
 * according to the specification.
 * If values are missing, this is not an issue.
 *
 * @param {{ key: string; name: string; description: string; }[]} decisionPointValues the valid elements of the values array of the respective decision point
 *                                   and their order according to the SSVC specification
 * @param {string[]} usedValues the actual used values of the decision point
 */
function areValuesValidAndinOrder(decisionPointValues, usedValues) {
  const specifiedValues = decisionPointValues.map((value) => value.name)
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
