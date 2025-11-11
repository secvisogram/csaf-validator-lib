import Ajv from 'ajv/dist/jtd.js'

/** @typedef {string} Product

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputSchema */

/** @typedef {InputSchema['vulnerabilities'][number]} Vulnerability */

/** @typedef {NonNullable<Vulnerability['metrics']>[number]} Metric */

const jtdAjv = new Ajv()

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
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
                products: {
                  elements: { type: 'string' },
                },
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    cvss_v2: {
                      additionalProperties: true,
                      optionalProperties: {
                        version: { type: 'string' },
                      },
                    },
                    cvss_v3: {
                      additionalProperties: true,
                      optionalProperties: {
                        version: { type: 'string' },
                      },
                    },
                    cvss_v4: {
                      additionalProperties: true,
                      optionalProperties: {
                        version: { type: 'string' },
                      },
                    },
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

const validate = jtdAjv.compile(inputSchema)

/**
 * For each item in `/vulnerabilities` it MUST be tested that no Qualitative Severity Rating and CVSS values are
 * listed for the tuple of Product ID and source.
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_56(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []

  if (!validate(doc)) {
    return ctx
  }

  /** @type {Array<Vulnerability>} */
  const vulnerabilities = doc.vulnerabilities

  /**
   * Create a unique string for the tuple of productId and source
   * to compare them easily
   * @param {string} productId
   * @param {string | undefined} source
   *
   * @return string
   */
  function createTupleStringForProductAndSource(productId, source) {
    return JSON.stringify({ productId: productId, source: source ?? '' })
  }

  /**
   * check whether the given metric contains a cvss (v2, v3 or v4) content
   * @param  {Metric}  metric
   * @returns {boolean}
   */
  function hasCvssContent(metric) {
    return (
      metric.content?.cvss_v2?.version !== undefined ||
      metric.content?.cvss_v3?.version !== undefined ||
      metric.content?.cvss_v4?.version !== undefined
    )
  }

  vulnerabilities.forEach((vulnerabilityItem, vulnerabilityIndex) => {
    /** @type {Map<string,string>} */
    const productIdServiceTuplesCvss = new Map()
    /** @type {Map<string,string>} */
    const productIdServiceTuplesRating = new Map()

    /** @type {Array<Metric> | undefined} */
    const metrics = vulnerabilityItem.metrics
    metrics?.forEach((metric, metricIndex) => {
      /** @type {Array<Product> | undefined} */
      const productsOfMetric = metric.products
      productsOfMetric?.forEach((product, productIndex) => {
        if (hasCvssContent(metric)) {
          productIdServiceTuplesCvss.set(
            createTupleStringForProductAndSource(product, metric.source),
            `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/products/${productIndex}`
          )
        }
        if (metric.content?.qualitative_severity_rating) {
          productIdServiceTuplesRating.set(
            createTupleStringForProductAndSource(product, metric.source),
            `/vulnerabilities/${vulnerabilityIndex}/metrics/${metricIndex}/products/${productIndex}`
          )
        }
      })
    })

    productIdServiceTuplesCvss.forEach((value, key) => {
      if (productIdServiceTuplesRating.has(key))
        errors.push({
          message:
            'in the metrics of the vulnerability a Qualitative Severity Rating and CVSS value ' +
            'with the same product id and source is used.',
          instancePath: value,
        })
    })
  })

  return { errors: errors, isValid: errors.length === 0 }
}
