import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

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
                text: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

// Invisible characters (e.g. zero-width spaces, soft hyphens) and white
// space can be used to obfuscate a CVE ID so that it evades a naive
// match. Strip them before testing, as required by the spec.
export const normalize = (/** @type {string} */ value) =>
  value.replace(/[\s\p{Cf}\p{Mn}]/gu, '')

/**
 * @param {any} doc
 */
export function recommendedTest_6_2_17(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    vulnerability.ids?.forEach((id, idIndex) => {
      if (id.text === undefined) {
        return
      }
      const normalizedText = normalize(id.text)
      if (normalizedText.match(/^CVE-[0-9]{4}-[0-9]{4,}$/)) {
        ctx.warnings.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/ids/${idIndex}/text`,
          message: `\`${id.text}\` looks like a CVE ID; use the \`cve\` property instead of \`ids\``,
        })
      }
    })
  })

  return ctx
}
