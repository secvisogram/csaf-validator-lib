import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const referenceSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    category: { type: 'string' },
    url: { type: 'string' },
  },
})
const validateReference = ajv.compile(referenceSchema)

/**
 * Convert the tracking id to apply the csaf filename conventions
 * - The value trackingId is converted into lower case
 * - Any character sequence which is not part of one of the following groups MUST be replaced by a single underscore (_)
 *   Lower case ASCII letters (0x61 - 0x7A)
 *   digits (0x30 - 0x39)
 *   special characters: + (0x2B), - (0x2D)
 * - The file extension .json MUST be appended.
 * @param  {string} trackingId
 * @return {string}
 */
export function convertTrackingIdToFilename(trackingId) {
  return trackingId.toLowerCase().replace(/[^+\-a-z0-9]+/g, '_') + '.json'
}

/**
 * Checks whether a URL has a non-empty hostname.
 *
 * @param {string} url
 * @return {boolean}
 */
export function hasHostname(url) {
  const afterScheme = url.slice(url.indexOf('://') + 3)
  return afterScheme.length > 0 && !afterScheme.startsWith('/')
}

/**
 * Checks whether a reference contains the canonical URL for a CSAF document.
 * Supports CSAF 2.0 and 2.1.
 * For CSAF 2.1, set `requireHostname` to `true` for  a non-empty hostname is required.
 *
 * @param {{url?: string, category?: string}} reference
 * @param {string} trackingId
 * @param {boolean} [requireHostname]
 * @return {boolean}
 */
export function isCanonicalUrl(reference, trackingId, requireHostname = false) {
  if (
    !validateReference(reference) ||
    reference.category !== 'self' ||
    reference.url === undefined ||
    !reference.url.startsWith('https://')
  ) {
    return false
  }

  const filename = convertTrackingIdToFilename(trackingId)

  if (!requireHostname) {
    return reference.url.endsWith(`/${filename}`)
  }

  const parsed = new URL(reference.url)
  return hasHostname(reference.url) && parsed.pathname.endsWith(`/${filename}`)
}
