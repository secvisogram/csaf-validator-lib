import { Ajv } from 'ajv/dist/jtd.js'
import { collectProductIdsFromFullProductPath } from './shared/docProductUtils.js'

const ajv = new Ajv()

/*
  Branch categories that denote "a version of the same product" as opposed to
  a different product/component altogether (e.g. `product_name`, `vendor`,
  `architecture`, ...). Two leaves are only considered different versions of
  "the same" product (and therefore potentially corresponding fixed/affected
  pairs) if both their own branch category is one of these.
 */
const VERSION_BRANCH_CATEGORIES = new Set(
  /** @type {Array<string | undefined>} */ ([
    'product_version',
    'product_version_range',
  ])
)

const branchSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    name: { type: 'string' },
    product: {
      additionalProperties: true,
      optionalProperties: {
        product_id: { type: 'string' },
      },
    },
    branches: {
      elements: {
        additionalProperties: true,
        properties: {},
      },
    },
  },
})

const subpathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    category: { type: 'string' },
    next_product_reference: { type: 'string' },
  },
})

const productPathSchema = /** @type {const} */ ({
  additionalProperties: true,
  optionalProperties: {
    beginning_product_reference: { type: 'string' },
    full_product_name: {
      additionalProperties: true,
      optionalProperties: {
        product_id: { type: 'string' },
      },
    },
    subpaths: {
      elements: subpathSchema,
    },
  },
})

/*
  This is the jtd schema that needs to match the input document so that the
  test is activated. If this schema doesn't match it normally means that the input
  document does not validate against the csaf json schema or optional fields that
  the test checks are not present.
 */
const inputSchema = /** @type {const} */ ({
  additionalProperties: true,
  properties: {
    document: {
      additionalProperties: true,
      properties: {
        category: {
          type: 'string',
        },
      },
    },
  },
  optionalProperties: {
    product_tree: {
      additionalProperties: true,
      optionalProperties: {
        branches: {
          elements: branchSchema,
        },
        product_paths: {
          elements: productPathSchema,
        },
      },
    },
    vulnerabilities: {
      elements: {
        additionalProperties: true,
        optionalProperties: {
          product_status: {
            additionalProperties: true,
            optionalProperties: {
              fixed: { elements: { type: 'string' } },
              first_fixed: { elements: { type: 'string' } },
              known_affected: { elements: { type: 'string' } },
            },
          },
        },
      },
    },
  },
})

const validate = ajv.compile(inputSchema)
const validateBranch = ajv.compile(branchSchema)

/**
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof branchSchema>} Branch
 * @typedef {import('ajv/dist/core.js').JTDDataType<typeof productPathSchema>} ProductPath
 * @typedef {{ beginning_product_reference?: string; subpaths: NonNullable<ProductPath['subpaths']> }} NormalizedProductPath
 * @typedef {{ category?: string; name?: string }} LineageSegment
 * @typedef {{ ancestry: LineageSegment[]; leafCategory: string | undefined }} BranchLineage
 */

/**
 * This implements the mandatory test 6.1.27.13 of the CSAF 2.1 standard.
 *
 * For each product listed in the product status group `fixed` in any
 * vulnerability, it is tested that a corresponding version of the product is
 * listed as `known_affected` in the same vulnerability.
 *
 * @param {unknown} doc
 */
export function mandatoryTest_6_1_27_13(doc) {
  /*
    The `ctx` variable holds the state that is accumulated during the test ran and is
    finally returned by the function.
   */
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  if (!validate(doc) || doc.document.category !== 'csaf_security_advisory') {
    return ctx
  }

  // All product ids that are defined anywhere in the product tree. If a fixed
  // product id can't be found here, its definition is missing and is
  // already reported by another test (e.g. mandatory test 6.1.1), so it is
  // skipped by this test.
  const definedIds = new Set(
    collectProductIdsFromFullProductPath(doc).map((p) => p.id)
  )

  // Maps a product id to all the branch lineages (ancestor path of
  // {category, name} pairs, plus the leaf branch's own category) it is
  // defined under. A product id can have more than one lineage if it is
  // (erroneously) defined multiple times in the product tree.
  /** @type {Map<string, BranchLineage[]>} */
  const branchLineages = new Map()

  /**
   * @param {Branch[] | undefined} branches
   * @param {LineageSegment[]} ancestry
   */
  const traverseBranches = (branches, ancestry) => {
    branches?.forEach((branch) => {
      const productId = branch.product?.product_id
      if (productId) {
        const lineages = branchLineages.get(productId) ?? []
        lineages.push({ ancestry, leafCategory: branch.category })
        branchLineages.set(productId, lineages)
      }
      if (Array.isArray(branch.branches)) {
        const childAncestry = [
          ...ancestry,
          { category: branch.category, name: branch.name },
        ]
        traverseBranches(
          branch.branches.filter((b) => validateBranch(b)),
          childAncestry
        )
      }
    })
  }
  traverseBranches(doc.product_tree?.branches, [])

  // Maps a product id (defined via `full_product_name.product_id`) to its
  // product path definition.
  /** @type {Map<string, NormalizedProductPath>} */
  const productPaths = new Map()
  doc.product_tree?.product_paths?.forEach((productPath) => {
    const productId = productPath.full_product_name?.product_id
    if (productId) {
      productPaths.set(productId, {
        beginning_product_reference: productPath.beginning_product_reference,
        subpaths: productPath.subpaths ?? [],
      })
    }
  })

  /**
   * @param {LineageSegment[]} a
   * @param {LineageSegment[]} b
   */
  const ancestryEqual = (a, b) =>
    a.length === b.length &&
    a.every(
      (segment, index) =>
        segment.category === b[index].category && segment.name === b[index].name
    )

  /**
   * Checks whether `idA` and `idB` are defined at the same position in the
   * branch structure of the product tree (same ancestor path) and whether
   * both leaf branches use a version related category (`product_version` or
   * `product_version_range`), i.e. they are different versions of "the same"
   * product as opposed to e.g. a sibling `product_name` or `architecture`
   * branch.
   *
   * @param {string} idA
   * @param {string} idB
   */
  const isBranchCorrespondence = (idA, idB) => {
    const lineagesA = branchLineages.get(idA)
    const lineagesB = branchLineages.get(idB)
    if (!lineagesA || !lineagesB) return false
    return lineagesA.some((la) =>
      lineagesB.some(
        (lb) =>
          ancestryEqual(la.ancestry, lb.ancestry) &&
          VERSION_BRANCH_CATEGORIES.has(la.leafCategory) &&
          VERSION_BRANCH_CATEGORIES.has(lb.leafCategory)
      )
    )
  }

  /**
   * Given a product path and the index of one of its `installed_with`
   * subpaths, this resolves the product id of "the product path leading to
   * but not including the relationship", i.e. the same beginning product
   * reference combined with all subpaths before the given index. If that
   * index is `0`, this is just the beginning product reference itself.
   *
   * Returns `undefined` if no product in the tree is explicitly defined for
   * that leading path.
   *
   * @param {NormalizedProductPath} productPath
   * @param {number} installedWithIndex
   * @returns {string | undefined}
   */
  const resolveLeadingProductPathId = (productPath, installedWithIndex) => {
    if (installedWithIndex === 0) {
      return productPath.beginning_product_reference
    }

    const prefix = productPath.subpaths.slice(0, installedWithIndex)
    for (const [candidateId, candidate] of productPaths) {
      const candidateSubpaths = candidate.subpaths
      if (
        candidateSubpaths.length !== prefix.length ||
        candidate.beginning_product_reference !==
          productPath.beginning_product_reference
      ) {
        continue
      }
      const isPrefixMatch = candidateSubpaths.every(
        (s, index) =>
          s.category === prefix[index].category &&
          s.next_product_reference === prefix[index].next_product_reference
      )
      if (isPrefixMatch) {
        return candidateId
      }
    }
    return undefined
  }

  /**
   * Resolves all "corresponding products" of `id` that arise from an
   * `installed_with` relationship, per the following two readings of the
   * spec note:
   *
   * (a) `id` is itself defined via a product path that contains an
   *     `installed_with` subpath (`id` is the combined product, e.g. "App
   *     installed with Hotfix") - the corresponding product is the path
   *     leading up to (but not including) that relationship (e.g. "App"
   *     alone).
   * (b) `id` is referenced as the `next_product_reference` of another
   *     product path's `installed_with` subpath (`id` is the add-on
   *     component itself, e.g. the hotfix) - the corresponding product is
   *     the path leading up to (but not including) that relationship in the
   *     *other* product path (e.g. "App" without the hotfix).
   *
   * @param {string} id
   * @returns {string[]}
   */
  const getInstalledWithCounterparts = (id) => {
    /** @type {string[]} */
    const counterparts = []

    // (a) `id` owns a product path that contains an `installed_with` subpath.
    const ownPath = productPaths.get(id)
    if (ownPath) {
      const index = ownPath.subpaths.findIndex(
        (s) => s.category === 'installed_with'
      )
      if (index !== -1) {
        const leading = resolveLeadingProductPathId(ownPath, index)
        if (leading) counterparts.push(leading)
      }
    }

    // (b) `id` is the target of an `installed_with` subpath in some other
    // product path.
    for (const productPath of productPaths.values()) {
      productPath.subpaths.forEach((subpath, index) => {
        if (
          subpath.category === 'installed_with' &&
          subpath.next_product_reference === id
        ) {
          const leading = resolveLeadingProductPathId(productPath, index)
          if (leading) counterparts.push(leading)
        }
      })
    }

    return counterparts
  }

  /**
   * Checks whether `idA` and `idB` are "corresponding products" as required
   * by this test, i.e. they occupy the same position in the product tree /
   * product path graph and differ in exactly one version related component,
   * or are related through an `installed_with` relationship.
   *
   * `visited` protects against infinite recursion on cyclic / self
   * referencing product paths (e.g. a product path that (in)directly
   * references itself via `beginning_product_reference` or
   * `next_product_reference`); a document with such a structure is invalid,
   * but this test must not crash on it.
   *
   * @param {string | undefined} idA
   * @param {string | undefined} idB
   * @param {Set<string>} [visited]
   * @returns {boolean}
   */
  const isCorrespondingProduct = (idA, idB, visited = new Set()) => {
    if (!idA || !idB || idA === idB) return false

    const visitedKey = idA < idB ? `${idA}\u0000${idB}` : `${idB}\u0000${idA}`
    if (visited.has(visitedKey)) return false
    visited.add(visitedKey)

    if (isBranchCorrespondence(idA, idB)) return true

    for (const counterpart of getInstalledWithCounterparts(idA)) {
      if (
        counterpart === idB ||
        isCorrespondingProduct(counterpart, idB, visited)
      ) {
        return true
      }
    }
    for (const counterpart of getInstalledWithCounterparts(idB)) {
      if (
        counterpart === idA ||
        isCorrespondingProduct(counterpart, idA, visited)
      ) {
        return true
      }
    }

    const pathA = productPaths.get(idA)
    const pathB = productPaths.get(idB)
    if (!pathA || !pathB) return false

    const subpathsA = pathA.subpaths
    const subpathsB = pathB.subpaths
    if (subpathsA.length !== subpathsB.length) return false

    const beginningEqual =
      pathA.beginning_product_reference === pathB.beginning_product_reference

    let subpathDiffIndex = -1
    for (let i = 0; i < subpathsA.length; i++) {
      const a = subpathsA[i]
      const b = subpathsB[i]
      if (
        a.category === b.category &&
        a.next_product_reference === b.next_product_reference
      ) {
        continue
      }
      if (
        subpathDiffIndex === -1 &&
        a.category === b.category &&
        isCorrespondingProduct(
          a.next_product_reference,
          b.next_product_reference,
          visited
        )
      ) {
        subpathDiffIndex = i
        continue
      }
      // more than one differing component, or a non-corresponding difference
      return false
    }

    if (beginningEqual && subpathDiffIndex !== -1) {
      // exactly one subpath component differs and it is a corresponding pair,
      // everything else (including the beginning product) is identical
      return true
    }

    if (
      !beginningEqual &&
      subpathDiffIndex === -1 &&
      isCorrespondingProduct(
        pathA.beginning_product_reference,
        pathB.beginning_product_reference,
        visited
      )
    ) {
      // only the beginning product reference differs and it is a
      // corresponding pair, all subpaths are identical
      return true
    }

    return false
  }

  doc.vulnerabilities?.forEach((vulnerability, vulnerabilityIndex) => {
    const productStatus = vulnerability.product_status
    if (!productStatus) return

    const affectedIds = new Set(productStatus.known_affected ?? [])

    /** @type {Array<{ id: string; instancePath: string }>} */
    const fixedEntries = []
    productStatus.fixed?.forEach((id, index) => {
      fixedEntries.push({
        id,
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status/fixed/${index}`,
      })
    })
    productStatus.first_fixed?.forEach((id, index) => {
      fixedEntries.push({
        id,
        instancePath: `/vulnerabilities/${vulnerabilityIndex}/product_status/first_fixed/${index}`,
      })
    })

    fixedEntries.forEach(({ id, instancePath }) => {
      // If the fixed product id is not defined anywhere in the product tree,
      // its definition is missing. This is reported by another test (e.g.
      // mandatory test 6.1.1), so it is skipped here.
      if (!definedIds.has(id)) return

      const hasCorrespondence = [...affectedIds].some((affectedId) =>
        isCorrespondingProduct(id, affectedId)
      )

      if (!hasCorrespondence) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath,
          message: `No corresponding version of product "${id}" is listed as affected (known_affected) in the same vulnerability`,
        })
      }
    })
  })

  return ctx
}
