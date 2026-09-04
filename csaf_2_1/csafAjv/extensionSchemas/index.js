import documentation11 from './documentation-11.js'
import documentation12 from './documentation-12.js'
import documentation13 from './documentation-13.js'

/**
 * @typedef {object} ExtensionSchemaEntry
 * @property {import('ajv').AnySchemaObject} schema
 * @property {'official' | 'registered' | 'experimental'} class Class per
 *   spec section 2.4.1 ("Classes").
 * @property {boolean} deprecated On the OASIS deprecated list (spec 2.4.2)?
 * @property {boolean} denyListed On the OASIS deny list (spec 2.4.2)? MUST
 *   NOT be used if true.
 */

/**
 * Allow list of CSAF Extension Schemas this validator implements locally
 * (per spec ch. 8, schemas are never fetched over the network).
 *
 * The OASIS official/registered/deprecated/deny-listed lists (spec 2.4.2)
 * aren't available as data here, so entries are limited to the
 * documentation-11/12/13 test fixtures (not for production use).
 * `documentation-11`'s class is fixed by the spec's own prose (recommended
 * tests 6.2.54.1/.2/.4): it's the failing example for "neither official nor
 * registered", i.e. `experimental`. `documentation-12`/`-13` have no such
 * fixture tie-in and are arbitrarily assigned `registered`/`official` so all
 * three code paths of recommendedTest_6_2_54_1 are exercised.
 *
 * To add a new schema: add a module next to this file (its `$id` must match
 * the `$schema` value used in documents), import it here, and add an entry.
 *
 * @type {ExtensionSchemaEntry[]}
 */
export const extensionSchemas = [
  {
    schema: documentation11,
    class: 'experimental',
    deprecated: false,
    denyListed: false,
  },
  {
    schema: documentation12,
    class: 'experimental',
    deprecated: false,
    denyListed: false,
  },
  {
    schema: documentation13,
    class: 'experimental',
    deprecated: false,
    denyListed: false,
  },
]

/**
 * Registers all allow-listed extension schemas on the given Ajv instance so
 * that `ajv.getSchema(schemaUrl)` resolves them without any network access.
 *
 * @param {import('ajv').default} ajv
 */
export function registerExtensionSchemas(ajv) {
  for (const { schema } of extensionSchemas) {
    ajv.addSchema(schema, schema.$id)
  }
}

/**
 * Classifies a CSAF Extension by its declared `$schema` URL. Returns the
 * class recorded in `extensionSchemas` if allow-listed, otherwise
 * `'unknown'` (the real OASIS lists aren't available as data here, so
 * guessing from the URL would be misleading).
 *
 * @param {string} schemaUrl
 * @returns {'official' | 'registered' | 'experimental' | 'unknown'}
 */
export function classifyExtensionSchema(schemaUrl) {
  const entry = extensionSchemas.find((e) => e.schema.$id === schemaUrl)
  return entry?.class ?? 'unknown'
}
