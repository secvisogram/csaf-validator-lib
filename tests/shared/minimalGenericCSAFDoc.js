const sortObjectKeys = require('../../lib/shared/sortObjectKeys.js')
const minimalDoc = require('./shared/minimalDoc.js')

module.exports = /** @type {typeof minimalDoc} */ (
  sortObjectKeys(new Intl.Collator(), {
    ...minimalDoc,
    document: {
      ...minimalDoc.document,
      category: 'generic_csaf',
    },
  })
)
