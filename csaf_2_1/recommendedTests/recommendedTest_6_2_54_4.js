import { Ajv } from 'ajv/dist/jtd.js'
import { walkPath } from '../../lib/walkPaths.js'
import { classifyExtensionSchema } from '#csaf_2_1/csafAjv/extensionSchemas/index.js'

const ajv = new Ajv()

const X_EXTENSIONS_PATHS /** @type {string[]} */ = [
  '/document/x_extensions[]',
  '/product_tree/branches[*]/product/x_extensions[]',
  '/product_tree/full_product_names[]/x_extensions[]',
  '/product_tree/product_paths[]/full_product_name/x_extensions[]',
  '/vulnerabilities[]/metrics[]/content/x_extensions[]',
  '/vulnerabilities[]/x_extensions[]',
  '/x_extensions[]',
]

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
        distribution: {
          additionalProperties: true,
          properties: {
            tlp: {
              additionalProperties: true,
              properties: {
                label: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)

/**
 * This implements the recommended test 6.2.54.4 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export async function recommendedTest_6_2_54_4(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  if (!validate(doc)) {
    return ctx
  }

  if (doc.document.distribution.tlp.label !== 'CLEAR') {
    return ctx
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const schemaUrl =
        value && typeof value === 'object' && '$schema' in value
          ? /** @type {{ $schema: String }} */ (value).$schema
          : undefined

      if (typeof schemaUrl !== 'string') return

      if (classifyExtensionSchema(schemaUrl) === 'experimental') {
        ctx.warnings.push({
          instancePath: `${instancePath}`,
          message: 'the extension is an experimental CSAF Extension',
        })
      }
    })
  }

  return ctx
}
