import Ajv from 'ajv/dist/jtd.js'
import { getWeaknessById } from '../../cwe'

const ALLOWED_VALUES = ["Allowed", "Allowed-with-Review"]
const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cwes: {
            elements: {
              additionalProperties: true,
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                version: { type: 'string' },
              }
            }
          }
        }
      }
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_25(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vi) => {
    vulnerability.cwes?.forEach((cwe, ci) => {
      const weakness = getWeaknessById(cwe.id)
      if (weakness && !ALLOWED_VALUES.includes(weakness.usage)) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${vi}/cwes/${ci}`,
          message: `The usage of ${weakness.id} id ${weakness.usage.toLowerCase()} as "${weakness.rationale}".`,
        })
      }
    })
  })

  return ctx
}
