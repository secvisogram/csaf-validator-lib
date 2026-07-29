import { createRequire } from 'module'
import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()
const require = createRequire(import.meta.url)
const registry =
  /** @type {{ entries: Array<{ system_name: string; text_pattern: string }> }} */ (
    // @ts-ignore — registry.json lives in the excluded csaf/ subtree
    require('../../csaf/registry/id/registry.json')
  )

/** @type {Array<{ system_name: string; text_pattern: RegExp }>} */
const registeredIdSystems = registry.entries.map(
  (/** @type {{ system_name: string; text_pattern: string }} */ entry) => ({
    system_name: entry.system_name,
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
 * For each item in vulnerabilities[].ids[] that has a registered system_name,
 * it is tested that the text matches the text_pattern from the RVISC registry.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_53(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
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
        warnings.push({
          instancePath: `/vulnerabilities/${vulnIndex}/ids/${idIndex}/text`,
          message: `the text does not match the text_pattern of the registered ID system "${id.system_name}"`,
        })
      }
    })
  })

  return context
}
