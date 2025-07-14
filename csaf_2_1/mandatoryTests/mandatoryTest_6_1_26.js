import Ajv from 'ajv/dist/jtd.js'

const jtdAjv = new Ajv()

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
})

const validateInput = jtdAjv.compile(inputSchema)

const profileValues = [
  'csaf_base',
  'csaf_security_incident_response',
  'csaf_informational_advisory',
  'csaf_security_advisory',
  'csaf_vex',
  'csaf_deprecated_security_advisory',
  'csaf_withdrawn',
  'csaf_superseded',
]
const prohibitedDocumentCategoryNames = [
  'securityincidentresponse',
  'informationaladvisory',
  'securityadvisory',
  'vex',
  'deprecatedsecurityadvisory',
  'withdrawn',
  'superseded',
]

/**
 * It MUST be tested that the document category is not equal to the (case-insensitive) name (without the prefix csaf_)
 * or value of any other profile than "CSAF Base". Any occurrences of dash, whitespace, and underscore characters are
 * removed from the values on both sides before the match.
 * Also, the value MUST NOT start with the reserved prefix csaf_ except if the value is csaf_base.
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_26(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }
  if (!validateInput(doc)) {
    return ctx
  }

  /** @type {string} */
  const category = doc.document.category

  // Skip test if profile is not "CSAF Base" but one of the other profiles or matches exactly "csaf_base"
  if (profileValues.includes(category)) {
    return ctx
  }

  // Fail on reserved prefix
  if (category.toLowerCase().startsWith('csaf_')) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/category',
      message: 'reserved prefix used',
    })

    return ctx
  }

  // Fail on name similarity
  if (
    prohibitedDocumentCategoryNames.includes(
      category.replace(/[_-\s]+/g, '').toLowerCase()
    )
  ) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/category',
      message: 'value prohibited',
    })
  }
  return ctx
}
