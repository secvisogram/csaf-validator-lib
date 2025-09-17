import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */

/** @typedef {InputSchema['vulnerabilities'][number]} Vulnerability */

/** @typedef {NonNullable<Vulnerability['metrics']>[number]} Metric */

/** @typedef {NonNullable<Metric['content']>} MetricContent */

const jtdAjv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        references: {
          elements: {
            additionalProperties: true,
            properties: {
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
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                source: {
                  type: 'string',
                },
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    qualitative_severity_rating: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

/** @typedef {{ url: string; category: string}} Reference */

const referenceSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    category: { type: 'string' },
    url: { type: 'string' },
  },
})

const validate = jtdAjv.compile(inputSchema)
const validateReference = ajv.compile(referenceSchema)

/**
 * Get the canonical url from the document
 * @return {string} canonical url or empty when no canonical url exists
 * @param {Array<Reference> | undefined} references
 * @param {string | undefined} trackingId
 */
function getCanonicalUrl(references, trackingId) {
  if (references && trackingId) {
    // Find the reference that matches our criteria
    /** @type {Reference| undefined} */
    const canonicalUrlReference = references.find(
      (reference) =>
        validateReference(reference) &&
        reference.category === 'self' &&
        reference.url.startsWith('https://') &&
        reference.url.endsWith(
          trackingId.toLowerCase().replace(/[^+\-a-z0-9]+/g, '_') + '.json'
        )
    )

    // When we find a matching reference, we know it has the url property
    // because validateReference ensures it matches the Reference schema
    return canonicalUrlReference?.url ?? ''
  } else {
    return ''
  }
}

/**
 *  check whether metric has a  qualitative_severity_rating
 *  and no `source` or `source` that is equal to the canonical URL.
 * @param {Metric}  metric
 * @param {string} canonicalURL
 * @return {boolean}
 */
function hasServerRatingAndNoSource(metric, canonicalURL) {
  return (
    (!metric.source || metric.source === canonicalURL) &&
    !!metric?.content?.qualitative_severity_rating
  )
}

/**
 * For each item in `metrics` provided by the issuing party it MUST be tested
 * that it does not use the qualitative severity rating.
 * This covers all items in `metrics` that do not have a `source` property and those where the `source` is equal to
 * the canonical URL.
 *
/**
 * @param {any} doc
 */
export function recommendedTest_6_2_47(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const warnings = []
  const context = { warnings }

  if (!validate(doc)) {
    return context
  }

  /** @type {Array<Vulnerability>} */
  const vulnerabilities = doc.vulnerabilities
  const canonicalURL = getCanonicalUrl(
    doc.document.references,
    doc.document?.tracking?.id
  )

  vulnerabilities.forEach((vulnerabilityItem, vulnerabilityIndex) => {
    /** @type {Array<Metric> | undefined} */
    const metrics = vulnerabilityItem.metrics
    /** @type {Array<String> | undefined} */
    const invalidPaths = metrics
      ?.map((metric, metricIndex) =>
        hasServerRatingAndNoSource(metric, canonicalURL)
          ? `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/content/qualitative_severity_rating`
          : null
      )
      .filter((path) => path !== null)

    if (!!invalidPaths) {
      invalidPaths.forEach((path) => {
        context.warnings.push({
          message:
            'the metric has a qualitative severity rating and no source property' +
            ' or a source property that ist equal to the canonical URL',
          instancePath: path,
        })
      })
    }
  })

  return context
}
