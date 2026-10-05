import { Ajv } from 'ajv/dist/jtd.js'
import testURL from '#lib/informativeTests/shared/testURL.js'
import * as openpgp from 'openpgp'

const INSTANCE_PATH = '/document/publisher/contact/public_openpgp_key_url'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        publisher: {
          additionalProperties: true,
          optionalProperties: {
            contact: {
              additionalProperties: true,
              optionalProperties: {
                public_openpgp_key_url: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.55 of the CSAF 2.1 standard.
 *
 * It fetches the OpenPGP key referenced by
 * `document.publisher.contact.public_openpgp_key_url` and checks that it is
 * a valid, non-expired, ASCII-armored OpenPGP key usable for encryption,
 * delivered with the matching `application/pgp-keys` content type.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_55(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const url = doc.document?.publisher?.contact?.public_openpgp_key_url

  if (url === undefined) {
    return ctx
  }

  // Network error or client/server error status: skip, see 6.3.6 for
  // reporting unreachable URLs.
  const response = await testURL(url, () => {}, { method: 'GET' })
  if (!response) {
    return ctx
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/pgp-keys')) {
    ctx.warnings.push({
      instancePath: INSTANCE_PATH,
      message: 'Content-Type does not match `application/pgp-keys`',
    })
  }

  const armoredKey = await response.text()

  /** @type {openpgp.Key} */
  let publicKey
  try {
    publicKey = await openpgp.readKey({ armoredKey })
  } catch (e) {
    ctx.warnings.push({
      instancePath: INSTANCE_PATH,
      message: 'Content retrieved is not ASCII-armored',
    })
    return ctx
  }

  const expirationTime = await publicKey.getExpirationTime()
  const isExpired =
    expirationTime instanceof Date && expirationTime.getTime() <= Date.now()
  if (isExpired) {
    ctx.warnings.push({
      instancePath: INSTANCE_PATH,
      message: 'OpenPGP key retrieved is expired',
    })
  } else {
    // Only checked when not already expired: an expired key always fails
    // `getEncryptionKey()` too, which would otherwise produce a redundant,
    // less specific warning on top of the "expired" one.
    try {
      await publicKey.getEncryptionKey()
    } catch (e) {
      ctx.warnings.push({
        instancePath: INSTANCE_PATH,
        message: 'OpenPGP retrieved is not usable for encryption',
      })
    }
  }

  return ctx
}
