import { Ajv } from 'ajv/dist/jtd.js'

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
    document: {
      additionalProperties: true,
      properties: {
        category: {
          type: 'string',
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          cve: { type: 'string' },
          ids: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                product_ids: { elements: { type: 'string' } },
                group_ids: { elements: { type: 'string' } },
              },
            },
          },
          product_status: {
            values: { elements: { type: 'string' } },
          },
        },
      },
    },
  },
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        product_groups: {
          elements: {
            additionalProperties: true,
            properties: {
              group_id: { type: 'string' },
              product_ids: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/** @typedef {import('ajv/dist/jtd.js').JTDDataType<typeof inputSchema>} InputDoc */
/** @typedef {InputDoc['vulnerabilities'][number]} Vulnerability */
/** @typedef {NonNullable<Vulnerability['ids']>[number]} VulnerabilityId */
/** @typedef {NonNullable<NonNullable<InputDoc['product_tree']>['product_groups']>[number]} ProductGroup */

/**
 * This implements the mandatory test 6.1.27.8 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_27_8(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc) || doc.document.category !== 'csaf_vex') {
    return ctx
  }

  /** @type {Map<string, Set<string>>} */
  const groupProductMap = new Map()
  /** @type {ProductGroup[] | undefined} */
  const productGroups = doc.product_tree?.product_groups
  if (Array.isArray(productGroups)) {
    for (const group of productGroups) {
      groupProductMap.set(group.group_id, new Set(group.product_ids))
    }
  }

  /** @type {Vulnerability[]} */
  const vulnerabilities = doc.vulnerabilities
  vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
    if (
      ['ids', 'cve'].every(
        (propertyName) => vulnerability[propertyName] === undefined
      )
    ) {
      ctx.isValid = false
      ctx.errors.push({
        instancePath: `/vulnerabilities/${vulnerabilityIndex}`,
        message:
          'Neither a CVE nor a general vulnerability id (ids) is given for this vulnerability.',
      })
      return
    }

    if (vulnerability.cve !== undefined) return

    if (!Array.isArray(vulnerability.ids)) return

    const allScoped = vulnerability.ids.every(
      (id) =>
        (Array.isArray(id.product_ids) && id.product_ids.length > 0) ||
        (Array.isArray(id.group_ids) && id.group_ids.length > 0)
    )
    if (!allScoped) return

    const coveredProducts = getAllCoveredProducts(
      vulnerability.ids,
      groupProductMap
    )

    const productStatus = vulnerability.product_status
    if (productStatus === undefined) return

    const productStatusErrors = checkProductStatus(
      productStatus,
      coveredProducts,
      vulnerabilityIndex
    )
    if (productStatusErrors.length > 0) {
      ctx.isValid = false
      ctx.errors.push(...productStatusErrors)
    }
  })

  return ctx
}

/**
 * Collects all product ids covered by the given ids entries,
 * resolving group_ids via groupProductMap.
 * @param {VulnerabilityId[]} ids
 * @param {Map<string, Set<string>>} groupProductMap
 * @returns {Set<string>}
 */
function getAllCoveredProducts(ids, groupProductMap) {
  const coveredProducts = new Set()
  for (const id of ids) {
    if (Array.isArray(id.product_ids)) {
      for (const pid of id.product_ids) {
        coveredProducts.add(pid)
      }
    }
    if (Array.isArray(id.group_ids)) {
      for (const gid of id.group_ids) {
        const members = groupProductMap.get(gid)
        if (members) {
          for (const pid of members) {
            coveredProducts.add(pid)
          }
        }
      }
    }
  }
  return coveredProducts
}

/**
 * Checks that every product referenced in product_status is covered.
 * Returns the errors found for uncovered products.
 * @param {Record<string, string[]>} productStatus
 * @param {Set<string>} coveredProducts
 * @param {number} vulnerabilityIndex
 * @returns {Array<{ message: string; instancePath: string }>}
 */
function checkProductStatus(
  productStatus,
  coveredProducts,
  vulnerabilityIndex
) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  for (const [statusKey, productIds] of Object.entries(productStatus)) {
    productIds.forEach((productId, productIdIndex) => {
      if (!coveredProducts.has(productId)) {
        errors.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status/${statusKey}/${productIdIndex}`,
          message:
            `product id \`${productId}\` does not have a vulnerability id assigned` +
            ` nor a CVE or general vulnerability id is given`,
        })
      }
    })
  }
  return errors
}
