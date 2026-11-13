import { Ajv } from 'ajv/dist/jtd.js'
import { isCanonicalUrl } from '#lib/shared/urlHelper.js'

const ajv = new Ajv()

const referenceSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    url: { type: 'string' },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        references: {
          elements: referenceSchema,
        },
        tracking: {
          additionalProperties: true,
          optionalProperties: {
            id: { type: 'string' },
          },
        },
      },
    },
  },
})
const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof referenceSchema>} Reference
 */

/**
 * This implements the recommended test 6.2.11 of the CSAF 2.1 standard.
 *
 * It MUST be tested that the document contains at least one reference with category "self"
 * and a valid URL that fulfills the requirements of a valid filename for a CSAF document.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_11(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  /** @type {Array<Reference & { index: number }>} */
  const selfReferences =
    doc.document.references
      ?.map((reference, index) => ({ ...reference, index }))
      .filter((ref) => ref.category === 'self') ?? []

  if (selfReferences.length === 0) {
    return ctx
  }

  const trackingId = doc.document.tracking.id
  if (!trackingId) {
    return ctx
  }

  const hasValidSelfReference = selfReferences.some((reference) =>
    isCanonicalUrl(reference, trackingId, true)
  )

  if (hasValidSelfReference) {
    return ctx
  }

  selfReferences.forEach((reference) => {
    ctx.warnings.push({
      instancePath: `/document/references/${reference.index}/url`,
      message:
        'The reference category is "self", but the URL does not fulfill the requirements of a valid filename for a CSAF document.',
    })
  })

  return ctx
}
