import { Ajv } from 'ajv/dist/jtd.js'
import testURL from '#lib/informativeTests/shared/testURL.js'
import { walkPath } from '#lib/walkPaths.js'

const ajv = new Ajv()

const referenceSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    url: { type: 'string' },
    category: { type: 'string' },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    document: {
      additionalProperties: true,
      optionalProperties: {
        acknowledgments: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              urls: {
                elements: { type: 'string' },
              },
            },
          },
        },
        references: {
          elements: referenceSchema,
        },
        aggregate_severity: {
          additionalProperties: true,
          optionalProperties: {
            namespace: { type: 'string' },
          },
        },
        distribution: {
          additionalProperties: true,
          optionalProperties: {
            tlp: {
              additionalProperties: true,
              optionalProperties: {
                url: { type: 'string' },
              },
            },
          },
        },
        publisher: {
          additionalProperties: true,
          optionalProperties: {
            namespace: { type: 'string' },
          },
        },
      },
    },
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        full_product_names: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              product_identification_helper: {
                additionalProperties: true,
                optionalProperties: {
                  sbom_urls: { elements: { type: 'string' } },
                  x_generic_uris: {
                    elements: {
                      additionalProperties: true,
                      optionalProperties: {
                        namespace: { type: 'string' },
                        uri: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        branches: {
          elements: {
            additionalProperties: true,
            properties: {},
          },
        },
        product_paths: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: {
                additionalProperties: true,
                optionalProperties: {
                  product_identification_helper: {
                    additionalProperties: true,
                    optionalProperties: {
                      sbom_urls: { elements: { type: 'string' } },
                      x_generic_uris: {
                        elements: {
                          additionalProperties: true,
                          optionalProperties: {
                            namespace: { type: 'string' },
                            uri: { type: 'string' },
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
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          remediations: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                url: { type: 'string' },
              },
            },
          },
          acknowledgments: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                urls: {
                  elements: { type: 'string' },
                },
              },
            },
          },
          references: {
            elements: referenceSchema,
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateReference = ajv.compile(referenceSchema)

/**
 * CSAF 2.1 Informative Test 6.3.6:
 * verifies that all non-self references using URL fields resolve to HTTP 2xx or 3xx.
 *
 * @param {unknown} doc
 */
export async function informativeTest_6_3_6(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  for (const path of [
    '/document/acknowledgments[]/urls[]',
    '/document/aggregate_severity/namespace',
    '/document/distribution/tlp/url',
    '/document/publisher/namespace',
    '/product_tree/branches[*]/product/product_identification_helper/sbom_urls[]',
    '/product_tree/branches[*]/product/product_identification_helper/x_generic_uris[]/namespace',
    '/product_tree/branches[*]/product/product_identification_helper/x_generic_uris[]/uri',
    '/product_tree/full_product_names[]/product_identification_helper/sbom_urls[]',
    '/product_tree/full_product_names[]/product_identification_helper/x_generic_uris[]/namespace',
    '/product_tree/full_product_names[]/product_identification_helper/x_generic_uris[]/uri',
    '/product_tree/product_paths[]/full_product_name/product_identification_helper/sbom_urls[]',
    '/product_tree/product_paths[]/full_product_name/product_identification_helper/x_generic_uris[]/namespace',
    '/product_tree/product_paths[]/full_product_name/product_identification_helper/x_generic_uris[]/uri',
    '/vulnerabilities[]/acknowledgments[]/urls[]',
    '/vulnerabilities[]/remediations[]/url',
  ]) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (typeof value !== 'string') return
      await testURL(value, () => {
        ctx.infos.push({
          instancePath,
          message: 'use of non-self referencing urls failing to resolve',
        })
      })
    })
  }

  for (const path of [
    '/document/references[]',
    '/vulnerabilities[]/references[]',
  ]) {
    await walkPath(doc, path, async (instancePath, value) => {
      if (
        !validateReference(value) ||
        value.category === 'self' ||
        typeof value.url !== 'string'
      ) {
        return
      }

      await testURL(value.url, () => {
        ctx.infos.push({
          instancePath: instancePath + '/url',
          message: 'use of non-self referencing urls failing to resolve',
        })
      })
    })
  }

  return ctx
}
