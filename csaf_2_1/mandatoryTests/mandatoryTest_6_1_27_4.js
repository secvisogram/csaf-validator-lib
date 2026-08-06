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
  },
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      properties: {},
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * It MUST be tested that the element /product_tree exists.
 *
 * The relevant values for /document/category are:
 *  csaf_security_advisory
 *  csaf_vex
 *  csaf_deprecated_security_advisory
 *
 * @param {any} doc
 */
export function mandatoryTest_6_1_27_4(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validate(doc)) {
    return { errors, isValid }
  }

  const checkedDocumentCategories = new Set([
    'csaf_security_advisory',
    'csaf_vex',
    'csaf_deprecated_security_advisory',
  ])

  if (
    doc.product_tree === undefined &&
    checkedDocumentCategories.has(doc.document?.category)
  ) {
    isValid = false
    errors.push({
      instancePath: '/product_tree',
      message: 'needs a product_tree',
    })
  }
  return { errors, isValid }
}
