import Ajv from 'ajv/dist/jtd.js'

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

/**
 * Read Json from given URL
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

const validateInput = ajv.compile(inputSchema)
const ABOUTCODE_LICENSE_DB =
  'https://scancode-licensedb.aboutcode.org/index.json'
const SPDX_LICENSE_DB =
  'https://raw.githubusercontent.com/composer/spdx-licenses/refs/heads/main/res/spdx-licenses.json'

/**
 * It MUST be tested that at least one CWE is given.
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
  /** @type {Array<{ license_key: string; spdx_license_key: string }>} */
  const aboutcodeLicenses = await readJson(ABOUTCODE_LICENSE_DB)
  /** @type {Record<string, []>}  */
  const spdxLicenses = await readJson(SPDX_LICENSE_DB)

  const licenses = new Set(
    aboutcodeLicenses.map((aboutCode) => aboutCode.license_key)
  )
  Object.keys(spdxLicenses).forEach((item) => licenses.add(item))

  const license = doc.document.license_expression
  if (!licenses.has(license)) {
    ctx.infos.push({
      instancePath: '/document/license_expression',
      message: `Invalid license: '${license}'`,
    })
  }

  return ctx
}
