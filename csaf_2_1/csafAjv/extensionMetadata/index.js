import documentation11 from './documentation-11.js'
import documentation12 from './documentation-12.js'
import documentation13 from './documentation-13.js'

/**
 * Allow list of CSAF Extension Metadata that this validator has bundled
 * (statically, so it works isomorphically in both Node.js and the browser -
 * no filesystem or network access is performed).
 *
 * This currently only contains the "documentation-11/12/13" example
 * extensions used by the OASIS CSAF TC's own conformance test suite for
 * mandatory test 6.1.60.3 ("Extension Metadata"), mirroring the allow-list
 * pattern used for CSAF Extension Schemas (see `../extensionSchemas`,
 * mandatory test 6.1.60.2). It is NOT a production ready source of CSAF
 * Extension Metadata - callers that need real results should pass their own
 * `resolveExtensionMetadata` to `mandatoryTest_6_1_60_3` instead of relying
 * on this default.
 *
 * @type {Map<string, any>}
 */
const extensionMetadataRegistry = new Map([
  [documentation11.extension_schema, documentation11],
  [documentation12.extension_schema, documentation12],
  [documentation13.extension_schema, documentation13],
])

/**
 * Looks up the CSAF Extension Metadata registered for a given
 * `extension_schema` (i.e. CSAF Extension Content Schema) URL.
 *
 * @param {string} extensionSchemaUrl
 * @returns {any | undefined}
 */
export function getExtensionMetadata(extensionSchemaUrl) {
  return extensionMetadataRegistry.get(extensionSchemaUrl)
}

export default extensionMetadataRegistry
