import addFormats from 'ajv-formats'
import { Ajv2020 } from 'ajv/dist/2020.js'
import { request } from 'undici'
import cvss_v2_0 from '../schemas/cvss-v2.0.js'
import cvss_v3_0 from '../schemas/cvss-v3.0.js'
import cvss_v3_1 from '../schemas/cvss-v3.1.js'
import cvss_v4_0_0 from './csafAjv/cvss-v4.0.0.js'
import extension_content from './csafAjv/extension-content.js'
import content_schema from './csafAjv/content_schema.js'
import csaf_meta from './csafAjv/csaf_meta.js'
import cvss_meta from './csafAjv/cvss_meta.js'
import meta_format_assertion from './csafAjv/meta-format-assertion.js'
import draft_07_schema from './csafAjv/draft-07-schema.js'
import selectionList_2_0_0Schema from './csafAjv/SelectionList_2_0_0.schema.js'

import { validateTimestamp } from './dateHelper.js'

/**
 * Cache of in-flight/loaded remote schemas, keyed by URI, so that a schema
 * referenced multiple times (e.g. by several `x_extensions` in the same
 * document) is only fetched once per process.
 *
 * @type {Map<string, Promise<import('ajv').AnySchemaObject>>}
 */
const remoteSchemaCache = new Map()

/**
 * Loader used by ajv to resolve `$ref`s that point to schemas which are not
 * already registered via `addSchema` above (e.g. CSAF extension schemas
 * declared via a document's own `$schema` property).
 *
 * SECURITY NOTE: `uri` can originate directly from the document being
 * validated (attacker-controlled). Restricting the protocol to `https:`
 * blocks the obvious SSRF vectors (`file:`, plaintext `http:`), but not
 * requests to internal hosts reachable via `https:`. Further hardening
 * (request timeout, response size limit, redirect handling) is not
 * implemented yet and should be added for security-sensitive/production
 * environments.
 *
 * @param {string} uri
 * @returns {Promise<import('ajv').AnySchemaObject>}
 */
async function loadSchema(uri) {
  const cached = remoteSchemaCache.get(uri)
  if (cached) return cached

  const promise = (async () => {
    let parsed
    try {
      parsed = new URL(uri)
    } catch {
      throw new Error(`Cannot load schema "${uri}": not a valid URL`)
    }
    if (parsed.protocol !== 'https:') {
      throw new Error(
        `Cannot load schema "${uri}": only "https:" URLs may be loaded, got "${parsed.protocol}"`
      )
    }

    const res = await request(uri, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (res.statusCode < 200 || 400 <= res.statusCode) {
      throw new Error(
        `Cannot load schema "${uri}": received HTTP status ${res.statusCode}`
      )
    }
    return /** @type {Promise<import('ajv').AnySchemaObject>} */ (
      res.body.json()
    )
  })()

  remoteSchemaCache.set(uri, promise)
  // Don't keep failed lookups cached - allow a retry on the next call.
  promise.catch(() => remoteSchemaCache.delete(uri))
  return promise
}

const csafAjv = new Ajv2020({ strict: false, allErrors: true, loadSchema })
addFormats.default(csafAjv)
csafAjv.addMetaSchema(
  draft_07_schema,
  'http://json-schema.org/draft-07/schema#'
)
csafAjv.addSchema(cvss_v2_0, 'https://www.first.org/cvss/cvss-v2.0.json')
csafAjv.addSchema(cvss_v3_0, 'https://www.first.org/cvss/cvss-v3.0.json')
csafAjv.addSchema(cvss_v3_1, 'https://www.first.org/cvss/cvss-v3.1.json')
csafAjv.addSchema(cvss_meta, 'https://www.first.org/cvss/meta.json')
csafAjv.addSchema(
  content_schema,
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/extension-metaschema.json'
)
csafAjv.addSchema(
  meta_format_assertion,
  'https://json-schema.org/draft/2020-12/meta/format-assertion'
)
csafAjv.addSchema(
  csaf_meta,
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/meta.json'
)
csafAjv.addSchema(cvss_v4_0_0, 'https://www.first.org/cvss/cvss-v4.0.json')
csafAjv.addSchema(
  extension_content,
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/extension-content.json'
)
csafAjv.addSchema(
  selectionList_2_0_0Schema,
  'https://certcc.github.io/SSVC/data/schema/v2/SelectionList_2_0_0.schema.json'
)

csafAjv.addFormat('date-time', {
  type: 'string',
  validate: (v) => {
    return validateTimestamp(v).isValid
  },
})

export default csafAjv
