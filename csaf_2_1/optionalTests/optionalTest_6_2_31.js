import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              branches: {
                elements: {
                  additionalProperties: true,
                  optionalProperties: {
                    branches: {
                      elements: {
                        additionalProperties: true,
                        optionalProperties: {
                          product: {
                            additionalProperties: true,
                            optionalProperties: {
                              product_id: { type: 'string' },
                              product_identification_helper: {
                                additionalProperties: true,
                                optionalProperties: {
                                  serial_numbers: {
                                    elements: { type: 'string' },
                                  },
                                  model_numbers: {
                                    elements: { type: 'string' },
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
          },
        },
        relationships: {
          elements: {
            additionalProperties: true,
            properties: {
              product_reference: { type: 'string' },
              relates_to_product_reference: { type: 'string' },
            },
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * This implements the optional test 6.2.31 of the CSAF 2.1 standard.
 * @param {any} doc
 */
export function optionalTest_6_2_31(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) return ctx

  const relationships = doc.product_tree?.relationships ?? []

  doc.product_tree?.branches?.forEach((companyBranch, companyBranchIndex) => {
    companyBranch.branches?.forEach((productBranch, productBranchIndex) => {
      productBranch.branches?.forEach((firmwareBranch, firmwareBranchIndex) => {
        const product = firmwareBranch.product
        if (product?.product_id && product?.product_identification_helper) {
          const { serial_numbers, model_numbers } =
            product.product_identification_helper

          // Check if serial_numbers or model_numbers exist and if the product_id has a relationship
          if (
            (serial_numbers?.length || model_numbers?.length) &&
            !hasRelationship(relationships, product.product_id)
          ) {
            ctx.warnings.push({
              instancePath: `/product_tree/branches/${companyBranchIndex}/branches/${productBranchIndex}/branches/${firmwareBranchIndex}/product`,
              message: `product with product_id '${product.product_id}' has serial_numbers or model_numbers but no corresponding relationship.`,
            })
          }
        }
      })
    })
  })

  return ctx
}

/**
 * Helper function to check if a product_id exists in relationships
 * @param relationships {Array<{ product_reference: string; relates_to_product_reference: string }>}
 * @param productId {string}
 * @returns {boolean}
 */
function hasRelationship(
  relationships,
  productId
) {
  return relationships.some(
    (rel) =>
      rel.product_reference === productId ||
      rel.relates_to_product_reference === productId
  )
}
