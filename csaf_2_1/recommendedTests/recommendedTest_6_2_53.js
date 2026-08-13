import { Ajv } from 'ajv/dist/jtd.js'
import { entries } from '../../rvisc.js'

const ajv = new Ajv()

/** @type {Array<{ system_name: string; common_name: string; text_pattern: RegExp }>} */
const registeredIdSystems = entries.map(
  (
    /** @type {{ system_name: string; common_name: string; text_pattern: string }} */ entry
  ) => ({
    system_name: entry.system_name,
    common_name: entry.common_name,
    text_pattern: new RegExp(entry.text_pattern),
  })
)

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
                text: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */
/** @typedef {InputSchema['vulnerabilities'][number]} Vulnerability */

/**
 * This implements the recommended test 6.2.53 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_53(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  /** @type {Array<Vulnerability>} */
  const vulnerabilities = doc.vulnerabilities
  vulnerabilities.forEach((vulnerability, vulnIndex) => {
    const ids = vulnerability.ids ?? []
    ids.forEach((id, idIndex) => {
      if (id.system_name === undefined || id.text === undefined) return

      const registeredSystem = registeredIdSystems.find(
        (entry) => entry.system_name === id.system_name
      )
      if (!registeredSystem) return

      if (!registeredSystem.text_pattern.test(id.text)) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${vulnIndex}/ids/${idIndex}/text`,
          message: `the text does not match the text_pattern of the registered ID system "${registeredSystem.common_name}"`,
        })
      }
    })
  })

  return ctx
}
