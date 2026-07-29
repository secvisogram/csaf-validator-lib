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

const allowedCategoryValues = [
  'csaf_base',
  'csaf_security_incident_response',
  'csaf_informational_advisory',
  'csaf_security_advisory',
  'csaf_vex',
  'csaf_deprecated_security_advisory',
  'csaf_withdrawn',
  'csaf_superseded',
]

// dash-like (e.g. em dash, en dash, hyphen-minus) and connector-punctuation (e.g. underscore) characters, plus
// whitespace, independent of their graphical variants, per the spec's normalization rule
const SEPARATOR_PATTERN = /[\p{Pd}\p{Pc}\s]+/gu

const normalize = (/** @type {string} */ value) =>
  value.replace(SEPARATOR_PATTERN, '').toLowerCase()

const otherProfileValues = allowedCategoryValues.filter(
  (value) => value !== 'csaf_base'
)

// normalized name (without the csaf_ prefix) and value (with the csaf_ prefix) of every profile other than CSAF
// Base, used to detect a document category colliding with either form (e.g. "vex" or "csafvex" for "csaf_vex")
const prohibitedNormalizedCategories = otherProfileValues.flatMap((value) => [
  normalize(value),
  normalize(value.replace(/^csaf_/, '')),
])

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

  // Skip test for the allowedCategoryValues in /document/category:
  if (allowedCategoryValues.includes(category)) {
    return ctx
  }

  // Fail on reserved prefix
  if (category.toLowerCase().startsWith('csaf_')) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/category',
      message: 'reserved prefix "csaf_" used',
    })

    return ctx
  }

  // Fail on case-insensitive similarity to the name or value of another profile
  if (prohibitedNormalizedCategories.includes(normalize(category))) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/category',
      message: 'value prohibited',
    })
  }
  return ctx
}
