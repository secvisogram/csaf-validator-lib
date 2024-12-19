import Ajv from 'ajv/dist/jtd.js'

const ajv = new Ajv()

/** @type {{[key: string]: string[]}} */
const DISCOURAGED_GROUPS = {
  workaround: ["under_investigation"],
  mitigation: ["under_investigation"],
  vendor_fix: ["under_investigation"],
  optional_patch: ["fixed"],
  none_available: [],
  fix_planned: ["known_not_affected", "under_investigation"],
  no_fix_planned: ["known_not_affected"],
}

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
                elements: { type: 'string' },
              }
            }
          }
        }
      }
    }
  },
  properties: {
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              known_not_affected: { elements: { type: 'string' } },
              fixed: { elements: { type: 'string' } },
              under_investigation: { elements: { type: 'string' } },
            },
          },
          remediations: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                category: { type: 'string' },
                details: { type: 'string' },
                group_ids: {
                  elements: { type: 'string' },
                },
                product_ids: {
                  elements: { type: 'string' },
                }
              }
            }
          }
        }
      }
    },
  },
})

const validateInput = ajv.compile(inputSchema)

/**
 * @param {any} doc
 */
export default function optionalTest_6_2_22(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  doc.vulnerabilities.forEach((vulnerability, vi) => {
    vulnerability.remediations?.forEach((remediation, ri) => {
      // check every discouraged product status group
      const discouragedGroups = DISCOURAGED_GROUPS[remediation.category || ""]
      discouragedGroups?.forEach(discouragedGroup => {
        const discouragedGroupProducts = /** @type {string[]} */ (vulnerability.product_status?.[discouragedGroup])
        // check if a product is references in remediations
        discouragedGroupProducts?.forEach(pid => {
          let error = false

          // check product_ids
          remediation.product_ids?.forEach(id => {
            if (id === pid) {
              error = true
            }
          })

          // check group_ids
          remediation.group_ids?.forEach(id => {
            if (doc.product_tree?.product_groups?.find(group => group.group_id === id)?.product_ids?.some(id => id === pid)) {
              error = true
            }
          })

          if (error) {
            ctx.warnings.push({
              instancePath: `/vulnerabilities/${vi}/remediations/${ri}`,
              message: `Product with product ID \`${pid}\` is in remediation category ${remediation.category}, but has product status ${discouragedGroup}`,
            })
          }
        })
      })
    })
  })

  return ctx
}
