const minimalDoc = require('./shared/minimalDoc')

module.exports = {
  ...minimalDoc,
  document: {
    ...minimalDoc.document,
    category: 'security_advisory',
  },
  product_tree: {
    full_product_names: [
      {
        product_id: 'CSAFPID-0001',
        name: 'Some sample product',
      },
    ],
  },
}
