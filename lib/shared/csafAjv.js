import addFormats from 'ajv-formats'
import Ajv2020 from 'ajv/dist/2020.js'
import cvss_v2_0 from './csafAjv/cvss-v2.0.js'
import cvss_v3_0 from './csafAjv/cvss-v3.0.js'
import cvss_v3_1 from './csafAjv/cvss-v3.1.js'
import cvss_v4_0 from './csafAjv/cvss-v4.0.js'
import meta from './csafAjv/meta.js'
import formatAssertion from './csafAjv/format-assertion.js'
import ssvcDecisionPointValueSelection from './csafAjv/Decision_Point_Value_Selection-1-0-1.js'
import ssvcDecisionPoint from './csafAjv/Decision_Point-1-0-1.js'

const csafAjv = new Ajv2020({ strict: false, allErrors: true })
addFormats(csafAjv)
csafAjv.addSchema(cvss_v2_0, 'https://www.first.org/cvss/cvss-v2.0.json')
csafAjv.addSchema(cvss_v3_0, 'https://www.first.org/cvss/cvss-v3.0.json')
csafAjv.addSchema(cvss_v3_1, 'https://www.first.org/cvss/cvss-v3.1.json')
csafAjv.addSchema(cvss_v4_0, 'https://www.first.org/cvss/cvss-v4.0.json')
csafAjv.addSchema(
  meta,
  'https://docs.oasis-open.org/csaf/csaf/v2.1/schema/meta.json'
)
csafAjv.addSchema(
  formatAssertion,
  'https://json-schema.org/draft/2020-12/meta/format-assertion'
)
csafAjv.addSchema(
  ssvcDecisionPointValueSelection,
  'https://certcc.github.io/SSVC/data/schema/v1/Decision_Point_Value_Selection-1-0-1.schema.json'
)
csafAjv.addSchema(
  ssvcDecisionPoint,
  'https://certcc.github.io/SSVC/data/schema/v1/Decision_Point-1-0-1.schema.json'
)

csafAjv.addFormat('date-time', {
  type: 'string',
  validate: (v) => {
    /**
     * This regex validates a date against RFC 3339 section 5.6.
     * See: https://datatracker.ietf.org/doc/html/rfc3339#section-5.6
     */
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

    return dateRegex.test(v) && !Number.isNaN(new Date(v).getTime())
  },
})

export default csafAjv
