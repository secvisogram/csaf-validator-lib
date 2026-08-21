import { Ajv } from 'ajv/dist/jtd.js'
import { parse } from '#lib/spdx/spdx.js'

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
  /** @type {import('#lib/spdx/spdx.js').ParseResult} */
  let parseResult
  try {
    parseResult = parse(doc.document.license_expression)
  } catch (e) {
    if (e instanceof SyntaxError) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: '/document/license_expression',
        message: `invalid license expression "${licenseToCheck}": ${e.message}`,
      })
      return ctx
    } else {
      throw e
    }
  }

  /**
   * Recursively checks if a parsed license expression contains any license references.
   *
   * @param {import('#lib/spdx/spdx.js').ParseResult} parsedExpression - The parsed license expression
   */
  const check = (parsedExpression) => {
    if (parsedExpression.type === 'WITH_EXPRESSION') {
      const { value, with: withClause } = parsedExpression
      if (value.type === 'LICENSE_REF') {
        if (value.keyword !== 'LicenseRef') {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: '/document/license_expression',
            message: `misspelled license ref keyword: "${value.keyword}"`,
          })
        }

        if (value.prefix) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: '/document/license_expression',
            message: `license expression contains document-ref: "${value.prefix.value}"`,
          })
        }
      }

      if (withClause && withClause.type === 'ADDITION_REF') {
        if (withClause.keyword !== 'AdditionRef') {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: '/document/license_expression',
            message: `misspelled addition ref keyword: "${withClause.keyword}"`,
          })
        }

        if (withClause.prefix) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: '/document/license_expression',
            message: `license expression contains document-ref: "${withClause.prefix.value}"`,
          })
        }
      }
    } else {
      check(parsedExpression.left)
      check(parsedExpression.right)
    }
  }

  check(parseResult)

  return ctx
}
