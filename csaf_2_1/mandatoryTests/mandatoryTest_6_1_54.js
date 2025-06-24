import Ajv from 'ajv/dist/jtd.js'
import { validate, parse } from 'license-expressions'

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
        license_expression: {
          type: 'string',
        },
      },
    },
  },
})

const validateSchema = ajv.compile(inputSchema)

/**
 * Recursively checks if a parsed license expression contains any license references.
 *
 * @param {import('license-expressions').ParsedSpdxExpression} parsedExpression - The parsed license expression
 * @returns {boolean} True if the expression contains any license references, false otherwise
 */
function containsLicenseRef(parsedExpression) {
  // If it's a LicenseRef type directly
  if ('documentRef' in parsedExpression && parsedExpression.documentRef) {
    return true
  }

  // If it's a conjunction, check both sides
  if ('conjunction' in parsedExpression) {
    return (
      containsLicenseRef(parsedExpression.left) ||
      containsLicenseRef(parsedExpression.right)
    )
  }

  // If it's a LicenseInfo type, it doesn't contain a document reference
  return false
}

/**
 * Checks if a license expression contains any document references.
 * s. CSAF2.1. chapter 3.2.2.7 Document Property - License Expression
 * The DocumentRef part given in that ABNF MUST NOT be used in CSAF.
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license expression contains any document references, false otherwise
 */
export function hasDocumentRef(licenseToCheck) {
  const parseResult = parse(licenseToCheck)
  return containsLicenseRef(parseResult)
}

/**
 * Checks if a license expression is valid, according to SPDX standards.
 *
 * @param {string} licenseToCheck - The license expression to check
 * @returns {boolean} True if the license is valid, false otherwise
 */
export function isValidLicenseExpression(licenseToCheck) {
  return (
    !licenseToCheck ||
    (validate(licenseToCheck).valid && !hasDocumentRef(licenseToCheck))
  )
}

/**
 * It MUST be tested that the license expression is valid.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_54(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validateSchema(doc)) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression
  if (!isValidLicenseExpression(licenseToCheck)) {
    ctx.isValid = false
    ctx.errors.push({
      instancePath: '/document/license_expression',
      message: `Invalid license expression: "${licenseToCheck}"`,
    })
  }

  return ctx
}
