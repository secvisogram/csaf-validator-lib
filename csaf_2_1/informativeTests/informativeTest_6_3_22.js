import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    name: { type: 'string' },
    product_id: { type: 'string' },
  },
})

const subpathSchema = /** @type {const} */ ({
  additionalProperties: false,
  optionalProperties: {
    category: { type: 'string' },
    next_product_reference: { type: 'string' },
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: false,
  properties: {
    beginning_product_reference: { type: 'string' },
    full_product_name: fullProductNameSchema,
    subpaths: {
      elements: subpathSchema,
    },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the
  input document does not validate against the csaf json schema or optional
  fields that are inspected here are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_paths: {
          elements: productPathSchema,
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productPathSchema>} ProductPath
 */

/**
 * This implements the informative test 6.3.22 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 * @returns {{ infos: Array<{ message: string; instancePath: string }> }}
 */
export function informativeTest_6_3_22(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validate(doc) || !Array.isArray(doc.product_tree?.product_paths)) {
    return ctx
  }

  /** @type {ProductPath[]} */
  const productPaths = doc.product_tree.product_paths

  const pathProductIds = new Set(
    productPaths
      .map((path) => path.full_product_name?.product_id)
      .filter(/** @returns {id is string} */ (id) => !!id)
  )

  if (pathProductIds.size === 0) {
    return ctx
  }

  /**
   * @param {string | undefined} referencedProductId
   * @param {string} instancePath
   */
  const checkReference = (referencedProductId, instancePath) => {
    if (referencedProductId && pathProductIds.has(referencedProductId)) {
      ctx.infos.push({
        instancePath,
        message: `nested product path detected for product_id: ${referencedProductId}`,
      })
    }
  }

  productPaths.forEach((path, pathIndex) => {
    checkReference(
      path.beginning_product_reference,
      `/product_tree/product_paths/${pathIndex}/beginning_product_reference`
    )

    path.subpaths?.forEach((sub, subIndex) => {
      checkReference(
        sub.next_product_reference,
        `/product_tree/product_paths/${pathIndex}/subpaths/${subIndex}/next_product_reference`
      )
    })
  })

  return ctx
}
