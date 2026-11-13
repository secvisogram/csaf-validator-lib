import { Ajv } from 'ajv/dist/jtd.js'
import { entries } from '../../rvisc.js'

const ajv = new Ajv()

const registeredSystemNames = entries.map((entry) => entry.system_name)

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
          ids: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                system_name: { type: 'string' },
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
 * This implements the informative test 6.3.20 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 * @returns
 */
export function informativeTest_6_3_20(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    if (vulnerability.ids) {
      vulnerability?.ids.forEach((id, idIndex) => {
        if (id.system_name === undefined) return
        if (!registeredSystemNames.includes(id.system_name)) {
          ctx.infos.push({
            instancePath: `/vulnerabilities/${vulnerabilityIndex}/ids/${idIndex}/system_name`,
            message: `the system name ${id.system_name} is not registered in RVISC`,
          })
        }
      })
    }
  })

  return ctx
}
