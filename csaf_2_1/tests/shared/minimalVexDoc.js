import minimalDocCsaf2_1 from './shared/minimalDocCsaf2_1.js'

export default {
  ...minimalDocCsaf2_1,
  document: {
    ...minimalDocCsaf2_1.document,
    category: 'csaf_vex',
  },
  product_tree: {
    full_product_names: [
      {
        product_id: 'CSAFPID-0001',
        name: 'Some sample product',
        product_identification_helper: {
          hashes: [
            {
              file_hashes: [
                {
                  algorithm: 'sha256',
                  value:
                    '6ae24620ea9656230f49234efd0789356ae24620ea9656230f49234efd078935',
                },
              ],
              filename: 'product_a.so',
            },
          ],
        },
      },
    ],
  },
  vulnerabilities: [
    {
      notes: [
        {
          category: 'description',
          text: 'This is a sample note',
        },
      ],
      product_status: {
        fixed: ['CSAFPID-0001'],
      },
      cve: 'CVE-0000-1111',
    },
  ],
}
