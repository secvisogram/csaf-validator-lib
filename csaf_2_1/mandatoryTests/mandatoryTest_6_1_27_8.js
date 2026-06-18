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
            optionalProperties: {
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
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!validate(doc) || doc.document.category !== 'csaf_vex') {
    return { errors, isValid }
  }

  /** @type {Map<string, Set<string>>} */
  const groupProductMap = new Map()
  /** @type {ProductGroup[] | undefined} */
  const productGroups = doc.product_tree?.product_groups
  if (Array.isArray(productGroups)) {
    for (const group of productGroups) {
      if (
        typeof group.group_id === 'string' &&
        Array.isArray(group.product_ids)
      ) {
        groupProductMap.set(group.group_id, new Set(group.product_ids))
      }
    }
  }

  /** @type {Vulnerability[]} */
  const vulnerabilities = doc.vulnerabilities
  if (Array.isArray(vulnerabilities)) {
    vulnerabilities.forEach((vulnerability, vulnerabilityIndex) => {
      if (['ids', 'cve'].every((p) => vulnerability[p] === undefined)) {
        isValid = false
        errors.push({
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

      const productStatus =
        /** @type {Record<string, unknown> | null | undefined} */ (
          vulnerability.product_status
        )
      if (productStatus == null || typeof productStatus !== 'object') return

      const hadErrors = checkProductStatus(
        productStatus,
        coveredProducts,
        vulnerabilityIndex,
        errors
      )
      if (hadErrors) {
        isValid = false
      }
    })
  }

  return { errors, isValid }
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
 * Returns true if any uncovered products were found.
 * @param {Record<string, unknown>} productStatus
 * @param {Set<string>} coveredProducts
 * @param {number} vulnerabilityIndex
 * @param {Array<{ message: string; instancePath: string }>} errors
 * @returns {boolean}
 */
function checkProductStatus(
  productStatus,
  coveredProducts,
  vulnerabilityIndex,
  errors
) {
  let hadErrors = false
  for (const [statusKey, productIds] of Object.entries(productStatus)) {
    if (!Array.isArray(productIds)) continue
    productIds.forEach((productId, productIdIndex) => {
      if (typeof productId !== 'string') return
      if (!coveredProducts.has(productId)) {
        hadErrors = true
        errors.push({
          instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status/${statusKey}/${productIdIndex}`,
          message:
            `product id \`${productId}\` does not have a vulnerability id assigned` +
            ` nor a CVE or general vulnerability id is given`,
        })
      }
    })
  }
  return hadErrors
}
