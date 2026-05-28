import addFormats from 'ajv-formats'
import { Ajv2020 } from 'ajv/dist/2020.js'
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

import { timestampRegex, validateTimestamp } from './dateHelper.js'

const csafAjv = new Ajv2020({ strict: false, allErrors: true })
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
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/extension-metaschema.json#/$defs/content_schema_t'
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
    return timestampRegex.test(v) && validateTimestamp(v)
  },
})

export default csafAjv
