const minimalDoc = require('./shared/minimalDoc.js')

module.exports = {
  ...minimalDoc,
  document: {
    ...minimalDoc.document,
    category: 'generic_csaf',
  },
}
