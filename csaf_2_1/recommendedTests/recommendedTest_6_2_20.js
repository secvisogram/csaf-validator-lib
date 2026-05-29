import schema from '../schemaTests/csaf_2_1_strict/schema.js'
import csafAjv from '../csafAjv.js'
import { Ajv } from 'ajv/dist/jtd.js'

const ajv = new Ajv()
const validateStrictSchema = csafAjv.compile(schema)

const extensionSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    $schema: { type: 'string' },
    category: { type: 'string' },
  },
})

const fullProductNameSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    x_extensions: { elements: extensionSchema },
  },
})

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    product: fullProductNameSchema,
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})

const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    x_extensions: { elements: extensionSchema },
    document: {
      additionalProperties: true,
      optionalProperties: {
        x_extensions: { elements: extensionSchema },
      },
    },
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        full_product_names: { elements: fullProductNameSchema },
        branches: { elements: branchSchema },
        product_paths: {
          elements: {
            additionalProperties: true,
            optionalProperties: {
              full_product_name: fullProductNameSchema,
            },
          },
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          x_extensions: { elements: extensionSchema },
          metrics: {
            elements: {
              additionalProperties: true,
              optionalProperties: {
                content: {
                  additionalProperties: true,
                  optionalProperties: {
                    x_extensions: { elements: extensionSchema },
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

const validateInput = ajv.compile(inputSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof extensionSchema>} ExtensionSchema
 */

/**
 * This implements the recommended test 6.2.20 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_20(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  // Part 1: strict schema check – report any property not defined in the CSAF schema
  if (!validateStrictSchema(doc)) {
    const additionalPropertiesErrors =
      validateStrictSchema.errors?.filter(
        (e) =>
          e.keyword === 'additionalProperties' ||
          e.keyword === 'unevaluatedProperties'
      ) ?? []
    for (const error of additionalPropertiesErrors) {
      const propertyName =
        error.params.additionalProperty ?? error.params.unevaluatedProperty
      ctx.warnings.push({
        instancePath: `${error.instancePath}/${propertyName}`,
        message: `property "${propertyName}" is not defined in the schema`,
      })
    }
  }

  // Part 2: warn about unsupported CSAF Extensions
  if (!validateInput(doc)) return ctx

  if (doc.x_extensions) {
    checkExtensions(ctx.warnings, doc.x_extensions, '/x_extensions')
  }

  if (doc.document?.x_extensions) {
    checkExtensions(
      ctx.warnings,
      doc.document.x_extensions,
      '/document/x_extensions'
    )
  }

  doc.product_tree?.full_product_names?.forEach((fpn, j) => {
    if (fpn.x_extensions) {
      checkExtensions(
        ctx.warnings,
        fpn.x_extensions,
        `/product_tree/full_product_names/${j}/x_extensions`
      )
    }
  })

  if (doc.product_tree?.branches) {
    checkBranchExtensions(
      ctx.warnings,
      doc.product_tree.branches,
      '/product_tree/branches'
    )
  }

  doc.product_tree?.product_paths?.forEach((pp, j) => {
    if (pp.full_product_name?.x_extensions) {
      checkExtensions(
        ctx.warnings,
        pp.full_product_name.x_extensions,
        `/product_tree/product_paths/${j}/full_product_name/x_extensions`
      )
    }
  })

  doc.vulnerabilities?.forEach((vuln, j) => {
    if (vuln.x_extensions) {
      checkExtensions(
        ctx.warnings,
        vuln.x_extensions,
        `/vulnerabilities/${j}/x_extensions`
      )
    }
    vuln.metrics?.forEach((metric, k) => {
      if (metric.content?.x_extensions) {
        checkExtensions(
          ctx.warnings,
          metric.content.x_extensions,
          `/vulnerabilities/${j}/metrics/${k}/content/x_extensions`
        )
      }
    })
  })

  return ctx
}

/**
 * Checks an array of extensions for unsupported schemas
 * @param {Array<{ instancePath: string; message: string }>} warnings
 * @param {ExtensionSchema[]} extensions
 * @param {string} basePath
 */
function checkExtensions(warnings, extensions, basePath) {
  extensions.forEach((ext, i) => {
    warnings.push({
      instancePath: `${basePath}/${i}/$schema`,
      message: `unsupported CSAF Extension of schema "${ext.$schema}"`,
    })
  })
}

/**
 * Recursively checks branches for unsupported extensions
 * @param {Array<{ instancePath: string; message: string }>} warnings
 * @param {Branch[]} branches
 * @param {string} path
 */
function checkBranchExtensions(warnings, branches, path) {
  branches.forEach((branch, i) => {
    if (Array.isArray(branch?.product?.x_extensions)) {
      checkExtensions(
        warnings,
        branch.product.x_extensions,
        `${path}/${i}/product/x_extensions`
      )
    }
    if (Array.isArray(branch?.branches)) {
      checkBranchExtensions(warnings, branch.branches, `${path}/${i}/branches`)
    }
  })
}
