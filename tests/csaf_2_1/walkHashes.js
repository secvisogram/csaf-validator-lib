import { walkHashes } from '../../csaf_2_1/shared/csafHelpers/walkHashes.js'
import { productWithFileHashes } from './shared/csafDocHelper.js'

/**
 * @param {unknown} doc
 */
function collectPaths(doc) {
  /** @type {string[]} */
  const paths = []
  walkHashes(doc, ({ path }) => paths.push(path))
  return paths
}

const fileHashes = [{ algorithm: 'sha256', value: 'abcd' }]
const helperPath = 'product_identification_helper/hashes/0/file_hashes'

describe('walkHashes', function () {
  it('finds nothing when product_tree is not an object', function () {
    expect(collectPaths({ product_tree: 'string' })).to.deep.equal([])
  })

  it('finds nothing when there is no product_tree', function () {
    expect(collectPaths({})).to.deep.equal([])
  })

  it('finds hashes in full_product_names', function () {
    expect(
      collectPaths({
        product_tree: {
          full_product_names: [productWithFileHashes('a.exe', fileHashes)],
        },
      })
    ).to.deep.equal([`/product_tree/full_product_names/0/${helperPath}`])
  })

  it('finds hashes in branches', function () {
    expect(
      collectPaths({
        product_tree: {
          branches: [{ product: productWithFileHashes('a.exe', fileHashes) }],
        },
      })
    ).to.deep.equal([`/product_tree/branches/0/product/${helperPath}`])
  })

  it('finds hashes in nested child branches', function () {
    expect(
      collectPaths({
        product_tree: {
          branches: [
            {
              branches: [
                { product: productWithFileHashes('a.exe', fileHashes) },
              ],
            },
          ],
        },
      })
    ).to.deep.equal([
      `/product_tree/branches/0/branches/0/product/${helperPath}`,
    ])
  })

  it('skips an invalid child branch but still reports the parent', function () {
    expect(
      collectPaths({
        product_tree: {
          branches: [
            {
              product: productWithFileHashes('a.exe', fileHashes),
              branches: ['not-an-object'],
            },
          ],
        },
      })
    ).to.deep.equal([`/product_tree/branches/0/product/${helperPath}`])
  })

  it('finds hashes in product_paths full_product_name', function () {
    expect(
      collectPaths({
        product_tree: {
          product_paths: [
            { full_product_name: productWithFileHashes('a.exe', fileHashes) },
          ],
        },
      })
    ).to.deep.equal([
      `/product_tree/product_paths/0/full_product_name/${helperPath}`,
    ])
  })

  it('ignores a product_paths entry without full_product_name', function () {
    expect(
      collectPaths({ product_tree: { product_paths: [{}] } })
    ).to.deep.equal([])
  })

  it('ignores hashes without file_hashes', function () {
    expect(
      collectPaths({
        product_tree: {
          full_product_names: [
            {
              product_identification_helper: {
                hashes: [{ filename: 'a.exe' }],
              },
            },
          ],
        },
      })
    ).to.deep.equal([])
  })
})
