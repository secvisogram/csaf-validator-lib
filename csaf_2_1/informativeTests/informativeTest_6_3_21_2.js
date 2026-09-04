import { Ajv } from 'ajv/dist/jtd.js'
import { walkPath } from '../../lib/walkPaths.js'
import { classifyExtensionSchema } from '#csaf_2_1/csafAjv/extensionSchemas/index.js'

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

const validateInput = ajv.compile(inputSchema)

const X_EXTENSIONS_PATHS /** @type {string[]} */ = [
  '/document/x_extensions[]',
  '/product_tree/branches[*]/product/x_extensions[]',
  '/product_tree/full_product_names[]/x_extensions[]',
  '/product_tree/product_paths[]/full_product_name/x_extensions[]',
  '/vulnerabilities[]/metrics[]/content/x_extensions[]',
  '/vulnerabilities[]/x_extensions[]',
  '/x_extensions[]',
]

/**
 * This implements the informative test 6.3.21.2 of the CSAF 2.1 standard.
 * @param {unknown} doc
 * @returns
 */
export async function informativeTest_6_3_21_2(doc) {
  const ctx = {
    infos: /** @type {Array<{ message: string; instancePath: string }>} */ ([]),
  }

  if (!validateInput(doc)) {
    return ctx
  }

  if (doc.document.distribution.tlp.label === 'CLEAR') {
    return ctx
  }

  for (const path of X_EXTENSIONS_PATHS) {
    await walkPath(doc, path, async (instancePath, value) => {
      const schemaUrl =
        value && typeof value === 'object' && '$schema' in value
          ? /** @type {{ $schema: string }} */ (value).$schema
          : undefined
      if (schemaUrl === undefined) return

      if (classifyExtensionSchema(schemaUrl) === 'experimental') {
        ctx.infos.push({
          instancePath,
          message: `The extension is an experimental CSAF Extension`,
        })
      }
    })
  }

  return ctx
}
