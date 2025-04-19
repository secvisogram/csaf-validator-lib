import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/**
 * @typedef {'workaround'
 *  | 'mitigation'
 *  | 'vendor_fix'
 *  | 'optional_patch'
 *  | 'none_available'
 *  | 'fix_planned'
 *  | 'no_fix_planned'} Category
 */

/**
 * @typedef {'first_affected'
 *  | 'first_fixed'
 *  | 'fixed'
 *  | 'known_affected'
 *  | 'known_not_affected'
 *  | 'last_affected'
 *  | 'recommended'
 *  | 'under_investigation'} ProductStatus
 */

/**
 * This map holds prohibited category combinations.
 * See https://github.com/oasis-tcs/csaf/blob/master/csaf_2.1/prose/share/csaf-v2.1-draft.md#324131-vulnerabilities-property---remediations---category-
 *
 * @type {Map<string, Set<string>>}
 */
const prohibitionRuleMap = new Map(
  /** @satisfies {Array<[Category, ProductStatus[]]>} */ ([
    ['workaround', ['under_investigation']],
    ['mitigation', ['under_investigation']],
    ['vendor_fix', ['under_investigation']],
    ['optional_patch', ['first_fixed', 'fixed']],
    ['fix_planned', ['known_not_affected', 'under_investigation']],
    ['no_fix_planned', ['known_not_affected']],
  ]).map((e) => [e[0], new Set(e[1])])
)

const productStatusSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    first_affected: { elements: { type: 'string' } },
    first_fixed: { elements: { type: 'string' } },
    fixed: { elements: { type: 'string' } },
    known_affected: { elements: { type: 'string' } },
    known_not_affected: { elements: { type: 'string' } },
    last_affected: { elements: { type: 'string' } },
    recommended: { elements: { type: 'string' } },
    under_investigation: { elements: { type: 'string' } },
  },
})

const remediationSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    group_ids: {
      elements: {
        type: 'string',
      },
    },
    product_ids: {
      elements: {
        type: 'string',
      },
    },
    category: { type: 'string' },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_groups: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              group_id: { type: 'string' },
              product_ids: {
                elements: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: productStatusSchema,
          remediations: {
            elements: remediationSchema,
          },
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export function optionalTest_6_2_27(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (!doc.vulnerabilities) {
    return ctx // No vulnerabilities to check
  }

  for (const [vulnerabilityIndex, vulnerability] of Object.entries(
    doc.vulnerabilities
  )) {
    /**
     * This map holds all discovered product ids and maps them to the set of corresponding
     * remediation categories. Later we can check this map to find out if there are any
     * contradicting remediations.
     *
     * @type {Map<string, Set<string>>}
     */
    const productToCategoriesMap = new Map()

    /**
     * @type {any}
     */
    const productStatus = vulnerability.product_status;
    vulnerability.remediations?.forEach((remediation, remediationIndex) => {
      const category = remediation.category
      if (!category) return

      /**
       * This function adds the current category to the given product id in the
       * `productMap`. If the product does not yet exist in the map, it is added.
       *
       * @param {string} id
       */
      const collectCategory = (id) => {
        productToCategoriesMap.set(
          id,
          new Set(productToCategoriesMap.get(id)).add(category)
        )
      }

      remediation.product_ids?.forEach(collectCategory)

      remediation.group_ids?.forEach((id) => {
        const group = doc.product_tree?.product_groups?.find(
          (g) => g.group_id === id
        )
        if (!group) return
        group.product_ids?.forEach(collectCategory)
      })

      /**
       * Ensures that a product is not associated with a prohibited combination of product status and remediation category.
       */
      for (const [productId, categories] of productToCategoriesMap) {
        for (const category of categories) {
          const status = prohibitionRuleMap.get(category)
          if (!status) continue // No prohibition rules for this category
          status.forEach((s) => {
            if (productStatus && productStatus[s] ? productStatus[s].includes(productId): false){
              ctx.warnings.push({
                instancePath: `/vulnerabilities/${vulnerabilityIndex}/remediations/${remediationIndex}`,
                message: `Discouraged product status remediation combination for product id "${productId}" category ${category} and product status ${productStatus[s]}`,
              })
            }
          })
        }
      }
    })
  }

  return ctx
}
