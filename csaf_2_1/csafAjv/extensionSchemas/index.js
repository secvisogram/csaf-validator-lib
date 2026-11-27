import documentation11 from './documentation-11.js'
import documentation12 from './documentation-12.js'
import documentation13 from './documentation-13.js'

/**
 * @typedef {object} ExtensionSchemaEntry
 * @property {import('ajv').AnySchemaObject} schema
 * @property {'official' | 'registered' | 'experimental'} class Extension
 *   class as defined in spec section 2.4.1 ("Classes").
 * @property {boolean} deprecated Whether this extension is on the OASIS CSAF
 *   TC's list of deprecated extensions (spec section 2.4.2 "Lists"). Can
 *   still be used, but support for it will be removed in the near future.
 * @property {boolean} denyListed Whether this extension is on the OASIS CSAF
 *   TC's list of deny-listed extensions (spec section 2.4.2 "Lists"). MUST
 *   NOT be used.
 */

/**
 * Allow list of CSAF Extension Schemas that this validator explicitly
 * implements and supports at runtime.
 *
 * Per CSAF 2.1 spec chapter 8 ("Safety, Security, and Data Protection
 * Considerations"), CSAF validators SHOULD NOT automatically retrieve JSON
 * schemas from a URL declared in a CSAF document, and SHOULD instead keep a
 * local copy of all schemas necessary to fulfill their tasks. Therefore, no
 * schema referenced by an `x_extensions[].$schema` value is ever fetched over
 * the network - only the schemas listed here are used to validate mandatory
 * test 6.1.60.2.
 *
 * The `class`/`deprecated`/`denyListed` fields mirror the OASIS CSAF TC's
 * lists described in spec section 2.4.2 ("Lists"). Those lists are not
 * (yet) available as real, importable data in this repository - the entries
 * below are currently limited to the OASIS documentation-11/12/13 test
 * fixtures, which are themselves explicitly marked as "not allowed to be
 * used in a production CSAF" and are therefore classified as `experimental`.
 * The fields are still modeled explicitly so that real official/registered/
 * deprecated/deny-listed extensions can be added later without having to
 * change any consumer of this module.
 *
 * To add support for a new CSAF Extension Schema:
 * 1. Add a new module next to this file that exports the schema (its `$id`
 *    MUST match the `$schema` value that CSAF documents will declare).
 * 2. Import it here and add an entry to `extensionSchemas` below with its
 *    class and deprecated/deny-listed status.
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
 * Classifies a CSAF Extension by its declared `$schema` URL, used to
 * differentiate the warning raised for extensions that are not in the allow
 * list above (see mandatoryTest_6_1_60_2).
 *
 * For allow-listed schemas, this returns the explicit class recorded in
 * `extensionSchemas`. For any other schema, the class cannot be determined
 * reliably: this validator does not have access to the OASIS CSAF TC's real
 * lists of official/registered/deprecated/deny-listed extensions (spec
 * section 2.4.2 "Lists"), which are not available as data in this
 * repository, so guessing from the URL alone (e.g. by host name) would be
 * misleading. `'unknown'` is returned in that case instead.
 *
 * @param {string} schemaUrl
 * @returns {'official' | 'registered' | 'experimental' | 'unknown'}
 */
export function classifyExtensionSchema(schemaUrl) {
  const entry = extensionSchemas.find((e) => e.schema.$id === schemaUrl)
  return entry?.class ?? 'unknown'
}
