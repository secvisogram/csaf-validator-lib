import { Ajv } from 'ajv/dist/jtd.js'

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
    document: {
      additionalProperties: true,
      properties: {
        category: {
          type: 'string',
        },
      },
      optionalProperties: {
        references: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              category: {
                type: 'string',
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
 * It SHALL be tested that at least one item in `$.document.references` exists
 * that contains a link to an `external` source. The property `category` SHALL
 * be present for this item.
 *
 * The relevant values for /document/category are:
 *
 *   csaf_informational_advisory
 *   csaf_security_incident_response
 *   csaf_superseded
 * @param {any} doc
 */
export function mandatoryTest_6_1_27_2(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validate(doc)) {
    return { errors, isValid }
  }

  const checkedDocumentCategories = new Set([
    'csaf_informational_advisory',
    'csaf_security_incident_response',
    'csaf_superseded',
  ])

  const documentCategory = doc.document?.category

  if (!checkedDocumentCategories.has(documentCategory)) {
    return { errors, isValid }
  }

  const hasExternalReference = (doc.document.references ?? []).some(
    (r) => r.category === 'external'
  )

  if (!hasExternalReference) {
    isValid = false
    errors.push({
      instancePath: '/document/references',
      message: `\`${documentCategory}\` must have at least one document reference with category \`external\``,
    })
  }
  return { errors, isValid }
}
