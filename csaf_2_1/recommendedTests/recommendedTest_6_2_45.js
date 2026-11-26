import { Ajv } from 'ajv/dist/jtd.js'
import { allNonExistingLicenses } from '#lib/license/allNonExistingLicenses.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match, it normally means that the input
  document does not validate against the csaf JSON schema or optional fields that
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
 * It MUST be tested that all license identifier and exceptions used exist.
 * This SHALL be tested for the SPDX license list and Aboutcode's "ScanCode LicenseDB".
 * The test MAY be skipped for other license inventorying entities.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_45(doc) {
  /*
        The `ctx` variable holds the state that is accumulated during the test run and is
        finally returned by the function.
       */
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateSchema(doc)) {
    return ctx
  }

  const licenseToCheck = doc.document.license_expression

  const nonExistingLicenseIdentifier = allNonExistingLicenses(licenseToCheck)

  nonExistingLicenseIdentifier.forEach((licenseKey) => {
    ctx.warnings.push({
      instancePath: '/document/license_expression',
      message:
        `License identifier ${licenseKey} does not exist in ` +
        `the SPDX license list or Aboutcode's ScanCode LicenseDB`,
    })
  })

  return ctx
}
