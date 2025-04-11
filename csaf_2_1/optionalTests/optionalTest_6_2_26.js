import Ajv from 'ajv/dist/jtd.js'
import { cwecMap } from '../../lib/cwec.js'

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
        properties: {
          cwes: {
            elements: {
              additionalProperties: true,
              properties: {},
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

const cweSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    id: { type: 'string' },
    version: { type: 'string' },
    name: { type: 'string' },
  },
})

const validateCWE = ajv.compile(cweSchema)

/**
 * This implements the optional test 6.2.26 of the CSAF 2.1 standard.
 *
 * @param {any} doc
 */
export async function optionalTest_6_2_26(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validateInput(doc)) {
    return context
  }

  for (let i = 0; i < doc.vulnerabilities.length; ++i) {
    const vulnerability = doc.vulnerabilities[i]
    for (let j = 0; j < vulnerability.cwes.length; ++j) {
      const cwe = vulnerability.cwes.at(j)
      if (validateCWE(cwe)) {
        const cwec = cwecMap.get(cwe.version)
        if (!cwec) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/version`,
            message: 'no such cwe version is recognized',
          })
          continue
        }
        const entry = (await cwec()).default.weaknesses.find(
          (w) => w.id === cwe.id
        )
        if (!entry) {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
            message: `no weakness with this id is recognized in CWE ${cwe.version}`,
          })
          continue
        }
        //NOTE: the usage property is not available in cwe version 4.11 and older
        if (entry.usage !== 'Allowed') {
          context.warnings.push({
            instancePath: `/vulnerabilities/${i}/cwes/${j}/id`,
            message:
              'the usage of the weakness with the given id is not allowed',
          })
          continue
        }
      }
    }
  }

  return context
}
