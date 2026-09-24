import { walkPath } from '../../lib/walkPaths.js'
import { getExtensionMetadata as getExtensionMetadataFixtures } from '../csafAjv/extensionMetadata/index.js'

// All the places an `x_extensions` array can show up, and the key(s) used
// to look up its requirement in the extension's metadata `requirement`
// object. `product_tree.product_paths` has two possible keys because the
// extension-metadata.json schema still uses the old "relationships" name
// for that path in some places.
/**
 * @type {Array<{ walkPath: string; requirementKeys: string[] }>}
 */
const X_EXTENSIONS_ARRAY_PATHS = [
  {
    walkPath: '/document/x_extensions',
    requirementKeys: ['$.document.x_extensions'],
  },
  {
    walkPath: '/product_tree/branches[*]/product/x_extensions',
    requirementKeys: ['$.product_tree.branches..product.x_extensions'],
  },
  {
    walkPath: '/product_tree/full_product_names[]/x_extensions',
    requirementKeys: ['$.product_tree.full_product_names[*].x_extensions'],
  },
  {
    walkPath: '/product_tree/product_paths[]/full_product_name/x_extensions',
    requirementKeys: [
      '$.product_tree.product_paths[*].full_product_name.x_extensions',
      '$.product_tree.relationships[*].full_product_name.x_extensions', // old name, still used by some metadata files
    ],
  },
  {
    walkPath: '/vulnerabilities[]/metrics[]/content/x_extensions',
    requirementKeys: ['$.vulnerabilities[*].metrics[*].content.x_extensions'],
  },
  {
    walkPath: '/vulnerabilities[]/x_extensions',
    requirementKeys: ['$.vulnerabilities[*].x_extensions'],
  },
  {
    walkPath: '/x_extensions',
    requirementKeys: ['$.x_extensions'],
  },
]

/**
 * Looks up the requirement for a path in a CSAF Extension's metadata,
 * trying each of the given (alternative) requirement keys in order.
 *
 * @param {any} metadata
 * @param {string[]} requirementKeys
 * @returns {{ max_occurrence?: number } | undefined}
 */
function resolveRequirement(metadata, requirementKeys) {
  for (const key of requirementKeys) {
    const requirement = metadata?.requirement?.[key]
    if (requirement !== undefined) return requirement
  }
  return undefined
}

/**
 * A resolver looks up the CSAF Extension Metadata (shaped after
 * extension-metadata.json, i.e. exposing `requirement` and
 * `incompatible_extensions`) for a given extension content schema URL (the
 * `$schema` value of an `x_extensions` item).
 *
 * CSAF 2.1 doesn't define *how* to obtain this metadata for a given
 * `$schema` URL, only its shape - the OASIS CSAF TC maintains lists of
 * registered extensions and their metadata (Conformance Clause 34, "CSAF
 * Extension Bundle"), but fetching/caching that data is left to the caller.
 *
 * @callback ResolveExtensionMetadata
 * @param {string} schemaUrl
 * @returns {any | undefined | Promise<any | undefined>}
 */

/**
 * Mandatory test 6.1.60.3: for every CSAF Extension used under
 * `x_extensions`, checks that its metadata's requirements are met - the
 * extension is allowed at that path, its max_occurrence isn't exceeded, and
 * it's not combined with an incompatible extension at the same path.
 * Extensions for which `resolveExtensionMetadata` has no metadata only
 * produce a warning (naming the `$schema`), not an error.
 *
 * Note: the default `resolveExtensionMetadata` only knows about the small
 * set of example extensions bundled as test fixtures in
 * `csafAjv/extensionMetadata/index.js`. Pass in a real resolver backed by an
 * actual extension catalogue for production use, e.g.:
 *
 * ```js
 * const result = await mandatoryTest_6_1_60_3(doc, (schemaUrl) =>
 *   myExtensionCatalogue.get(schemaUrl)
 * )
 * ```
 *
 * @param {unknown} doc
 * @param {ResolveExtensionMetadata} [resolveExtensionMetadata]
 */
export async function mandatoryTest_6_1_60_3(doc, resolveExtensionMetadata) {
  const resolve = resolveExtensionMetadata ?? getExtensionMetadataFixtures
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  for (const extensionPath of X_EXTENSIONS_ARRAY_PATHS) {
    await walkPath(doc, extensionPath.walkPath, async (instancePath, value) => {
      if (!Array.isArray(value) || value.length === 0) return

      // Group the array's items by their $schema, so we can check
      // max_occurrence and incompatible_extensions per extension.
      /** @type {Map<string, number[]>} */
      const indexesBySchema = new Map()
      value.forEach((extension, index) => {
        const schemaUrl = extension?.$schema
        if (typeof schemaUrl !== 'string') return

        const indexes = indexesBySchema.get(schemaUrl) ?? []
        indexes.push(index)
        indexesBySchema.set(schemaUrl, indexes)
      })

      // Check each extension's max_occurrence requirement, and collect the
      // metadata for all extensions that are actually used at this path.
      const usedExtensions = []

      for (const [schemaUrl, indexes] of indexesBySchema) {
        const metadata = await resolve(schemaUrl)

        if (!metadata) {
          ctx.warnings.push({
            instancePath,
            message: `declared CSAF Extension "${schemaUrl}" is not supported and its metadata could not be evaluated`,
          })
          continue
        }

        const requirement = resolveRequirement(
          metadata,
          extensionPath.requirementKeys
        )
        const maxOccurrence = requirement?.max_occurrence ?? 0

        for (const index of indexes.slice(maxOccurrence)) {
          ctx.isValid = false
          ctx.errors.push({
            instancePath: `${instancePath}/${index}`,
            message:
              maxOccurrence <= 0
                ? `CSAF Extension "${schemaUrl}" is not allowed at path "${instancePath}"`
                : `CSAF Extension "${schemaUrl}" occurs ${indexes.length} times at path "${instancePath}" but only ${maxOccurrence} occurrence(s) are allowed`,
          })
        }

        if (maxOccurrence <= 0) continue
        usedExtensions.push({ schemaUrl, metadata })
      }

      // Check every pair of extensions used at this path for incompatibility.
      for (let i = 0; i < usedExtensions.length; i++) {
        for (let j = i + 1; j < usedExtensions.length; j++) {
          const a = usedExtensions[i]
          const b = usedExtensions[j]
          const incompatible =
            a.metadata.incompatible_extensions?.includes(b.schemaUrl) ||
            b.metadata.incompatible_extensions?.includes(a.schemaUrl)

          if (incompatible) {
            ctx.isValid = false
            ctx.errors.push({
              instancePath,
              message: `CSAF Extension "${a.schemaUrl}" is incompatible with CSAF Extension "${b.schemaUrl}" used at the same path`,
            })
          }
        }
      }
    })
  }

  return ctx
}
