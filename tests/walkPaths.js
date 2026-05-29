import { expect } from 'chai'
import { walkPath } from '../lib/walkPaths.js'

/**
 * @param {unknown} root
 * @param {string} path
 */
async function collect(root, path) {
  /** @type {Array<{ instancePath: string; value: unknown }>} */
  const results = []
  await walkPath(root, path, async function (instancePath, value) {
    results.push({ instancePath, value })
  })
  return results
}

describe('walkPath', function () {
  describe('object traversal', function () {
    it('resolves /foo on { foo: "bar" }', async function () {
      const results = await collect({ foo: 'bar' }, '/foo')
      expect(results).to.deep.equal([{ instancePath: '/foo', value: 'bar' }])
    })

    it('resolves /foo/bar on { foo: { bar: 42 } }', async function () {
      const results = await collect({ foo: { bar: 42 } }, '/foo/bar')
      expect(results).to.deep.equal([{ instancePath: '/foo/bar', value: 42 }])
    })

    it('resolves /a/b/c on { a: { b: { c: true } } }', async function () {
      const results = await collect({ a: { b: { c: true } } }, '/a/b/c')
      expect(results).to.deep.equal([{ instancePath: '/a/b/c', value: true }])
    })
  })

  describe('array [] traversal', function () {
    it('resolves /items[] on { items: ["x", "y"] }', async function () {
      const results = await collect({ items: ['x', 'y'] }, '/items[]')
      expect(results).to.deep.equal([
        { instancePath: '/items/0', value: 'x' },
        { instancePath: '/items/1', value: 'y' },
      ])
    })

    it('resolves /items[]/url on array of objects', async function () {
      const results = await collect(
        { items: [{ url: 'u1' }, { url: 'u2' }] },
        '/items[]/url'
      )
      expect(results).to.deep.equal([
        { instancePath: '/items/0/url', value: 'u1' },
        { instancePath: '/items/1/url', value: 'u2' },
      ])
    })

    it('resolves /a[]/b[] on nested arrays', async function () {
      const results = await collect(
        { a: [{ b: [1, 2] }, { b: [3] }] },
        '/a[]/b[]'
      )
      expect(results).to.deep.equal([
        { instancePath: '/a/0/b/0', value: 1 },
        { instancePath: '/a/0/b/1', value: 2 },
        { instancePath: '/a/1/b/0', value: 3 },
      ])
    })
  })

  describe('recursive descent [*]', function () {
    it('resolves /branches[*]/name flat (1 level)', async function () {
      const results = await collect(
        { branches: [{ name: 'root' }] },
        '/branches[*]/name'
      )
      expect(results).to.deep.equal([
        { instancePath: '/branches/0/name', value: 'root' },
      ])
    })

    it('resolves /branches[*]/name across 2 levels', async function () {
      const results = await collect(
        { branches: [{ name: 'root', branches: [{ name: 'child' }] }] },
        '/branches[*]/name'
      )
      expect(results).to.deep.equal([
        { instancePath: '/branches/0/name', value: 'root' },
        { instancePath: '/branches/0/branches/0/name', value: 'child' },
      ])
    })

    it('resolves /branches[*]/name across 3 levels', async function () {
      const results = await collect(
        {
          branches: [
            {
              name: 'L1',
              branches: [{ name: 'L2', branches: [{ name: 'L3' }] }],
            },
          ],
        },
        '/branches[*]/name'
      )
      expect(results).to.deep.equal([
        { instancePath: '/branches/0/name', value: 'L1' },
        { instancePath: '/branches/0/branches/0/name', value: 'L2' },
        {
          instancePath: '/branches/0/branches/0/branches/0/name',
          value: 'L3',
        },
      ])
    })
  })

  describe('edge cases', function () {
    it('returns empty array for null root', async function () {
      const results = await collect(null, '/foo')
      expect(results).to.deep.equal([])
    })

    it('returns empty array for undefined root', async function () {
      const results = await collect(undefined, '/foo')
      expect(results).to.deep.equal([])
    })

    it('returns empty array for missing property', async function () {
      const results = await collect({}, '/foo/bar')
      expect(results).to.deep.equal([])
    })

    it('returns empty array when mid-path value is null', async function () {
      const results = await collect({ foo: null }, '/foo/bar')
      expect(results).to.deep.equal([])
    })

    it('returns empty array for empty array target', async function () {
      const results = await collect({ items: [] }, '/items[]')
      expect(results).to.deep.equal([])
    })

    it('returns empty array when [] target is not an array', async function () {
      const results = await collect({ items: 'not-an-array' }, '/items[]')
      expect(results).to.deep.equal([])
    })
  })
})
