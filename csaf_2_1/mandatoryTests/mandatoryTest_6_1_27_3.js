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
    },
    vulnerabilities: {},
  },
})

const validate = ajv.compile(inputSchema)
/**
 * It MUST be tested that the element /vulnerabilities does not exist.
 *
 * The relevant values for /document/category are:
 *
 *   csaf_informational_advisory
 *   csaf_withdrawn
 *   csaf_superseded
 * @param {any} doc
 */
export function mandatoryTest_6_1_27_3(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validate(doc)) {
    return { errors, isValid }
  }

  const checkedDocumentCategories = new Set([
    'csaf_informational_advisory',
    'csaf_withdrawn',
    'csaf_superseded',
  ])

  if (
    doc.vulnerabilities !== undefined &&
    checkedDocumentCategories.has(doc.document?.category)
  ) {
    isValid = false
    errors.push({
      instancePath: '/vulnerabilities',
      message: 'must not exist',
    })
  }
  return { errors, isValid }
}
