import { Ajv } from 'ajv/dist/jtd.js'
import { deepEqual } from './shared/deepEqual.js'

const ajv = new Ajv()

const productIdentificationHelperSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    cpe: { type: 'string' },
    serial_numbers: { elements: { type: 'string' } },
    model_numbers: { elements: { type: 'string' } },
    purls: { elements: { type: 'string' } },
    sbom_urls: { elements: { type: 'string' } },
    skus: { elements: { type: 'string' } },
    hashes: {
      elements: {
        additionalProperties: true,
        properties: {
          filename: { type: 'string' },
          file_hashes: {
            elements: {
              additionalProperties: true,
              properties: {
                algorithm: { type: 'string' },
                value: { type: 'string' },
              },
            },
          },
        },
      },
    },
    x_generic_uris: {
      elements: {
        additionalProperties: true,
        properties: {
          namespace: { type: 'string' },
          uri: { type: 'string' },
        },
      },
    },
  },
})

const productSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_id: { type: 'string' },
    product_identification_helper: productIdentificationHelperSchema,
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
    product: productSchema,
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    full_product_name: productSchema,
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
        full_product_names: {
          elements: productSchema,
        },
        product_paths: {
          elements: productPathSchema,
        },
      },
    },
  },
})

const validateInput = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)
const validateProductIdentificationHelper = ajv.compile(
  productIdentificationHelperSchema
)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productIdentificationHelperSchema>} ProductIdentificationHelper
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 */

/**
 * This implements the recommended test 6.2.32 of the CSAF 2.1 standard.
 * @param {unknown} doc
 */
export function recommendedTest_6_2_32(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validateInput(doc)) return ctx
  const productTree = doc.product_tree
  if (!productTree) return ctx

  /** @type {Array<{helper: ProductIdentificationHelper; instancePath: string}>} */
  const helpers = []

  productTree.branches?.forEach((branch, i) => {
    collectFromBranch(branch, `/product_tree/branches/${i}`, helpers)
  })

  productTree.full_product_names?.forEach((product, i) => {
    const pih = product.product_identification_helper
    if (pih !== undefined && validateProductIdentificationHelper(pih)) {
      helpers.push({
        helper: pih,
        instancePath: `/product_tree/full_product_names/${i}/product_identification_helper`,
      })
    }
  })

  productTree.product_paths?.forEach((pp, i) => {
    const pih = pp.full_product_name?.product_identification_helper
    if (pih !== undefined && validateProductIdentificationHelper(pih)) {
      helpers.push({
        helper: pih,
        instancePath: `/product_tree/product_paths/${i}/full_product_name/product_identification_helper`,
      })
    }
  })

  /** @type {Map<string, string>} */
  const seen = new Map()
  /** @type {Map<string, Array<{obj: unknown; instancePath: string}>>} */
  const seenObjects = new Map()
  for (const { helper, instancePath } of helpers) {
    checkHelper(helper, instancePath, seen, seenObjects, ctx.warnings)
  }

  return ctx
}

/**
 * @param {Branch} branch
 * @param {string} instancePath
 * @param {Array<{helper: ProductIdentificationHelper; instancePath: string}>} result
 */
function collectFromBranch(branch, instancePath, result) {
  if (!validateBranch(branch)) return
  const pih = branch.product?.product_identification_helper
  if (pih !== undefined && validateProductIdentificationHelper(pih)) {
    result.push({
      helper: pih,
      instancePath: `${instancePath}/product/product_identification_helper`,
    })
  }
  branch.branches?.forEach((sub, i) => {
    collectFromBranch(sub, `${instancePath}/branches/${i}`, result)
  })
}

/**
 * @param {ProductIdentificationHelper} helper
 * @param {string} instancePath
 * @param {Map<string, string>} seen
 * @param {Map<string, Array<{obj: unknown; instancePath: string}>>} seenObjects
 * @param {Array<{instancePath: string; message: string}>} warnings
 */
function checkHelper(helper, instancePath, seen, seenObjects, warnings) {
  if (helper.cpe !== undefined) {
    const key = `cpe:${helper.cpe}`
    const firstPath = seen.get(key)
    if (firstPath !== undefined) {
      warnings.push({
        instancePath: `${instancePath}/cpe`,
        message: `cpe "${helper.cpe}" is already used at "${firstPath}".`,
      })
    } else {
      seen.set(key, `${instancePath}/cpe`)
    }
  }

  const stringArrayCategories = /** @type {const} */ ([
    'serial_numbers',
    'model_numbers',
    'purls',
    'sbom_urls',
    'skus',
  ])
  for (const category of stringArrayCategories) {
    const values = helper[category]
    if (values !== undefined) {
      values.forEach((value, index) => {
        const key = `${category}:${value}`
        const firstPath = seen.get(key)
        if (firstPath !== undefined) {
          warnings.push({
            instancePath: `${instancePath}/${category}/${index}`,
            message: `The value "${value}" in "${category}" is already used at "${firstPath}".`,
          })
        } else {
          seen.set(key, `${instancePath}/${category}/${index}`)
        }
      })
    }
  }

  const objectArrayCategories = /** @type {const} */ ([
    'hashes',
    'x_generic_uris',
  ])
  for (const category of objectArrayCategories) {
    const objects = helper[category]
    if (objects !== undefined) {
      if (!seenObjects.has(category)) {
        seenObjects.set(category, [])
      }
      const seenList =
        /** @type {Array<{obj: unknown; instancePath: string}>} */ (
          seenObjects.get(category)
        )
      objects.forEach((obj, index) => {
        const currentPath = `${instancePath}/${category}/${index}`
        const match = seenList.find((entry) => deepEqual(entry.obj, obj))
        if (match !== undefined) {
          warnings.push({
            instancePath: currentPath,
            message: `The value in "${category}" at index ${index} is already used at "${match.instancePath}".`,
          })
        } else {
          seenList.push({ obj, instancePath: currentPath })
        }
      })
    }
  }
}
