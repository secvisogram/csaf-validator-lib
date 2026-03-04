import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        references: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              category: { type: 'string' },
              url: { type: 'string' },
            },
          },
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
 * Test for the optional test 6.2.11
 * @param {any} doc
 */
export function recommendedTest_6_2_11(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  const trackingId = doc.document.tracking.id
  if (!trackingId) {
    return ctx
  }

  const filename = transformTrackingIdToFilename(trackingId)

  const selfReferences =
    doc.document.references
      ?.map((reference, index) => ({ ...reference, index }))
      .filter((ref) => ref.category === 'self') ?? []

  if (selfReferences.length === 0) {
    return ctx
  }

  const hasValidSelfReference = selfReferences.some((reference) => {
    const url = reference.url || ''
    return (
      typeof url === 'string' &&
      url.startsWith('https://') &&
      url.endsWith(filename)
    )
  })

  if (hasValidSelfReference) {
    return ctx
  }

  selfReferences.forEach((reference) => {
    const url = reference.url || ''
    const referenceIndex = reference.index

    if (
      typeof url !== 'string' ||
      !url.startsWith('https://') ||
      !url.endsWith(filename)
    ) {
      ctx.warnings.push({
        instancePath: `/document/references/${referenceIndex}/url`,
        message:
          'The reference category is "self", but the URL does not fulfill the requirements of a valid filename for a CSAF document.',
      })
    }
  })

  return ctx
}

/** * Transforms a tracking ID into a filename.
 *
 * @param {string} trackingId
 * @returns {string} filename
 */
function transformTrackingIdToFilename(trackingId) {
  const lowerCase = trackingId.toLowerCase()
  const replacedString = lowerCase.replace(/[^+\-a-z0-9]+/g, '_')
  return replacedString + '.json'
}
