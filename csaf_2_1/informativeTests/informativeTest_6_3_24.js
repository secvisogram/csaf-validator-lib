import { Ajv } from 'ajv/dist/jtd.js'
import testURL from '#lib/informativeTests/shared/testURL.js'
import * as openpgp from 'openpgp'

const INSTANCE_PATH = '/document/publisher/contact/public_openpgp_key_url'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
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
                email: { type: 'string' },
                public_openpgp_key_url: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * Removes a `+tag` suffix from the local part of an email address (plus
 * addressing), e.g. `foo+bar@example.com` becomes `foo@example.com`, so addresses that route to
 * the same mailbox are considered a match.
 *
 * @param {string} email
 */
function stripPlusTag(email) {
  const atIndex = email.lastIndexOf('@')
  if (atIndex === -1) {
    return email
  }
  const localPart = email.slice(0, atIndex)
  const domainPart = email.slice(atIndex)
  const plusIndex = localPart.indexOf('+')
  return (
    (plusIndex === -1 ? localPart : localPart.slice(0, plusIndex)) + domainPart
  )
}

/**
 * This implements the informative test 6.3.24 of the CSAF 2.1 standard.
 *
 * It fetches the OpenPGP key referenced by
 * `document.publisher.contact.public_openpgp_key_url` and checks that it
 * delivers a public OpenPGP key with an email in the user ID matching the
 * sibling property `email`.
 *
 * @param {unknown} doc
 */
export async function informativeTest_6_3_24(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  const url = doc.document?.publisher?.contact?.public_openpgp_key_url
  const email = doc.document?.publisher?.contact?.email

  if (url === undefined || email === undefined) {
    return ctx
  }

  // Network error or client/server error status: skip, see 6.3.6 for
  // reporting unreachable URLs.
  const response = await testURL(url, () => {}, { method: 'GET' })
  if (!response) {
    return ctx
  }

  const armoredKey = await response.text()

  /** @type {openpgp.Key} */
  let publicKey
  try {
    publicKey = await openpgp.readKey({ armoredKey })
  } catch (e) {
    // Not ASCII-armored: skip, see 6.2.55 for reporting this case.
    return ctx
  }

  const userIDEmails = publicKey.users
    .map((user) => user.userID?.email)
    .filter(/** @returns {email is string} */ (email) => !!email)

  if (userIDEmails.length === 0) {
    ctx.infos.push({
      instancePath: INSTANCE_PATH,
      message: 'no email given in the user ID of the OpenPGP key retrieved',
    })
    return ctx
  }

  const normalizedEmail = stripPlusTag(email)
  const matches = userIDEmails.some(
    (userIDEmail) => stripPlusTag(userIDEmail) === normalizedEmail
  )

  if (!matches) {
    ctx.infos.push({
      instancePath: INSTANCE_PATH,
      message:
        `email \`${userIDEmails[0]}\` provided in the user ID of the OpenPGP key retrieved ` +
        `does not match email \`${email}\` given in the CSAF document`,
    })
  }

  return ctx
}
