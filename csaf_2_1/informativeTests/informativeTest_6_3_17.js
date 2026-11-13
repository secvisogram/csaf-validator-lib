import { Ajv } from 'ajv/dist/jtd.js'
import { allNonExistingLicenses } from '../recommendedTests/recommendedTest_6_2_45.js'

const ajv = new Ajv()

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

const validateInput = ajv.compile(inputSchema)

/**
 * It SHALL be tested that all license identifiers and exceptions are listed either
 * in the official SPDX license identifier list or AboutCode's "ScanCode LicenseDB".
 * @param {unknown} doc
 */
export function informativeTest_6_3_17(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  allNonExistingLicenses(doc.document.license_expression).forEach(
    (licenseKey) => {
      ctx.infos.push({
        instancePath: '/document/license_expression',
        message:
          `License identifier ${licenseKey} is not listed in ` +
          `the SPDX license list or Aboutcode's ScanCode LicenseDB`,
      })
    }
  )

  return ctx
}
