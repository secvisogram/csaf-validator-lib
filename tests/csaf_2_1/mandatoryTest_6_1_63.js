import { mandatoryTest_6_1_63 } from '../../csaf_2_1/mandatoryTests.js'
import { HASH_ALGORITHM_LENGTHS } from '../../csaf_2_1/shared/csafHelpers/hashAlgorithms.js'

describe('mandatoryTest_6_1_63', function () {
  /** @param {string} algorithm */
  const docWithAlgorithm = (algorithm) => ({
    product_tree: {
      full_product_names: [
        {
          product_identification_helper: {
            hashes: [{ file_hashes: [{ algorithm, value: 'abcd' }] }],
          },
        },
      ],
    },
  })

  it('ignores file hashes without algorithm or value', function () {
    const result = mandatoryTest_6_1_63({
      product_tree: {
        full_product_names: [
          {
            product_identification_helper: {
              hashes: [
                {
                  file_hashes: [{ value: 'abcd' }, { algorithm: 'sha256' }, {}],
                },
              ],
            },
          },
        ],
      },
    })
    expect(result.isValid).to.equal(true)
    expect(result.errors).to.deep.equal([])
    expect(result.warnings).to.deep.equal([])
  })

  it('warns that an algorithm is not supported and not in the spec', function () {
    const result = mandatoryTest_6_1_63(docWithAlgorithm('foo-hash'))
    expect(result.isValid).to.equal(true)
    expect(result.warnings).to.deep.equal([
      {
        instancePath:
          '/product_tree/full_product_names/0/product_identification_helper/hashes/0/file_hashes/0/algorithm',
        message:
          "the hash algorithm 'foo-hash' is not specified in section 3.1.10.3.2 and is not supported by this implementation.",
      },
    ])
  })

  it('warns that the length of an algorithm in the spec is unknown', function () {
    const original = HASH_ALGORITHM_LENGTHS.sha256
    delete HASH_ALGORITHM_LENGTHS.sha256
    try {
      const result = mandatoryTest_6_1_63(docWithAlgorithm('sha256'))
      expect(result.isValid).to.equal(true)
      expect(result.warnings).to.deep.equal([
        {
          instancePath:
            '/product_tree/full_product_names/0/product_identification_helper/hashes/0/file_hashes/0/algorithm',
          message:
            "the hash algorithm 'sha256' is specified in section 3.1.10.3.2 but is not supported by this implementation.",
        },
      ])
    } finally {
      HASH_ALGORITHM_LENGTHS.sha256 = original
    }
  })
})
