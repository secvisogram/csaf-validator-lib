import { recommendedTest_6_2_52 } from '../../csaf_2_1/recommendedTests/recommendedTest_6_2_52.js'
import { productWithFileHashes } from './shared/csafDocHelper.js'

describe('recommendedTest_6_2_52', function () {
  it('warns for unsupported algorithm in product_tree.branches product hashes', function () {
    const result = recommendedTest_6_2_52({
      product_tree: {
        branches: [
          {
            product: productWithFileHashes('product.exe', [
              { algorithm: 'md9000' },
            ]),
          },
        ],
      },
    })
    expect(result.warnings.length).to.equal(1)
    expect(result.warnings[0].instancePath).to.equal(
      '/product_tree/branches/0/product/product_identification_helper/hashes/0/file_hashes/0/algorithm'
    )
    expect(result.warnings[0].message).to.match(/md9000/)
  })

  it('does not warn when algorithm is undefined', function () {
    const result = recommendedTest_6_2_52({
      product_tree: {
        full_product_names: [productWithFileHashes('product.exe', [{}])],
      },
    })
    expect(result.warnings.length).to.equal(0)
  })

  it('does not warn for secure spec-listed algorithms', function () {
    const secureAlgorithms = [
      'blake2b512',
      'blake2s256',
      'sha224',
      'sha256',
      'sha3-224',
      'sha3-256',
      'sha3-384',
      'sha3-512',
      'sha384',
      'sha512',
      'sha512-224',
      'sha512-256',
      'shake128',
      'shake256',
      'sm3',
    ]
    for (const algorithm of secureAlgorithms) {
      const result = recommendedTest_6_2_52({
        product_tree: {
          full_product_names: [
            productWithFileHashes('product.exe', [
              {
                algorithm,
                value:
                  '026a37919b182ef7c63791e82c9645e2f897a3f0b73c7a6028c7febf62e93838',
              },
            ]),
          ],
        },
      })
      expect(result.warnings.length).to.deep.equal(
        0,
        `expected no warning for secure algorithm '${algorithm}'`
      )
    }
  })

  it('warns for insecure but spec-listed algorithms with distinct message', function () {
    const insecureAlgorithms = [
      'md4',
      'md5',
      'md5-sha1',
      'mdc2',
      'ripemd',
      'ripemd160',
      'rmd160',
      'sha1',
      'ssl3-md5',
      'ssl3-sha1',
      'whirlpool',
    ]
    for (const algorithm of insecureAlgorithms) {
      const result = recommendedTest_6_2_52({
        product_tree: {
          full_product_names: [
            productWithFileHashes('product.exe', [
              {
                algorithm,
                value:
                  '026a37919b182ef7c63791e82c9645e2f897a3f0b73c7a6028c7febf62e93838',
              },
            ]),
          ],
        },
      })
      expect(result.warnings.length).to.deep.equal(
        1,
        `expected 1 warning for insecure algorithm '${algorithm}'`
      )
      expect(result.warnings[0].message).to.match(
        /secure/,
        `expected 'secure' in warning message for '${algorithm}'`
      )
    }
  })
})
