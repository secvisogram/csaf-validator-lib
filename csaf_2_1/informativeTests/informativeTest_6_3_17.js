import Ajv from 'ajv/dist/jtd.js'

const ABOUTCODE_LICENSE_DB =
  'https://scancode-licensedb.aboutcode.org/index.json'
const SPDX_LICENSE_DB =
  'https://raw.githubusercontent.com/composer/spdx-licenses/refs/heads/main/res/spdx-licenses.json'

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
 * Read JSON from given URL
 * @param {string | URL | Request} dataUrl
 * @returns
 */
async function readJson(dataUrl) {
  /** @type {any} */
  const headers = { Accept: 'application/vnd.github.v3+json' }
  const response = await fetch(dataUrl, { headers })
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`)
  }

  return await response.json()
}

/**
 * Read considered licenses from SPDX and About Code
 * @returns {Promise<Set<string>>}
 */
async function readConsideredLicenses() {
  /** @type {Array<{ license_key: string; spdx_license_key: string }>} */
  const aboutcodeLicenses = await readJson(ABOUTCODE_LICENSE_DB)
  /** @type {Record<string, []>}  */
  const spdxLicenses = await readJson(SPDX_LICENSE_DB)

  const consideredLicenses = new Set(
    aboutcodeLicenses.map((aboutCode) => aboutCode.license_key)
  )
  Object.keys(spdxLicenses).forEach((item) => consideredLicenses.add(item))
  return consideredLicenses
}

/**
 * It MUST be tested that the all license identifiers and exceptions are listed either
 * in the official SPDX license identifier list or AboutCode's "ScanCode LicenseDB".
 * @param {unknown} doc
 * @returns
 */
export async function informativeTest_6_3_17(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const consideredLicenses = await readConsideredLicenses()

  const licenseToCheck = doc.document.license_expression
  if (!consideredLicenses.has(licenseToCheck)) {
    ctx.infos.push({
      instancePath: '/document/license_expression',
      message: `Invalid license: '${licenseToCheck}'`,
    })
  }

  return ctx
}
