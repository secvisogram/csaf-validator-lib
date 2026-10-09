import { Ajv } from 'ajv/dist/jtd.js'
import { collectProductIdsFromFullProductPath } from './shared/docProductUtils.js'

const ajv = new Ajv()

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
 * @typedef {{ category?: string; name?: string }} LineageSegment
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

  // Maps a product id to all the ancestor branch lineages (path of
  // {category, name} pairs, not including the leaf branch itself) it is
  // defined under. A product id can have more than one lineage if it is
  // (erroneously) defined multiple times in the product tree.
  /** @type {Map<string, LineageSegment[][]>} */
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
        lineages.push(ancestry)
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
  /** @type {Map<string, ProductPath>} */
  const productPaths = new Map()
  doc.product_tree?.product_paths?.forEach((productPath) => {
    const productId = productPath.full_product_name?.product_id
    if (productId) {
      productPaths.set(productId, productPath)
    }
  })

  /**
   * @param {LineageSegment[]} a
   * @param {LineageSegment[]} b
   */
  const lineagesEqual = (a, b) =>
    a.length === b.length &&
    a.every(
      (segment, index) =>
        segment.category === b[index].category && segment.name === b[index].name
    )

  /**
   * Checks whether `idA` and `idB` are defined at the same position in the
   * branch structure of the product tree, differing only in the leaf branch
   * (i.e. they are different versions of "the same" product).
   *
   * @param {string} idA
   * @param {string} idB
   */
  const isBranchCorrespondence = (idA, idB) => {
    if (idA === idB) return false
    const lineagesA = branchLineages.get(idA)
    const lineagesB = branchLineages.get(idB)
    if (!lineagesA || !lineagesB) return false
    return lineagesA.some((la) => lineagesB.some((lb) => lineagesEqual(la, lb)))
  }

  /**
   * Checks whether `idA` and `idB` are "corresponding products" as required
   * by this test, i.e. they occupy the same position in the product tree /
   * product path graph and differ in exactly one version related component.
   *
   * @param {string | undefined} idA
   * @param {string | undefined} idB
   */
  const isCorrespondingProduct = (idA, idB) => {
    if (!idA || !idB || idA === idB) return false

    if (isBranchCorrespondence(idA, idB)) return true

    const pathA = productPaths.get(idA)
    const pathB = productPaths.get(idB)
    if (!pathA || !pathB) return false

    const subpathsA = pathA.subpaths ?? []
    const subpathsB = pathB.subpaths ?? []
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
          b.next_product_reference
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
        pathB.beginning_product_reference
      )
    ) {
      // only the beginning product reference differs and it is a
      // corresponding pair, all subpaths are identical
      return true
    }

    return false
  }

  /**
   * Handles the special `installed_with` relationship case: if `fixedId` is
   * used as the `next_product_reference` of an `installed_with` subpath, the
   * product path leading up to (but not including) that relationship is a
   * corresponding product.
   *
   * @param {string} fixedId
   * @param {Set<string>} affectedIds
   */
  const hasInstalledWithCorrespondence = (fixedId, affectedIds) => {
    for (const productPath of productPaths.values()) {
      const subpaths = productPath.subpaths ?? []
      for (let i = 0; i < subpaths.length; i++) {
        if (
          subpaths[i].category !== 'installed_with' ||
          subpaths[i].next_product_reference !== fixedId
        ) {
          continue
        }

        if (i === 0) {
          const beginningRef = productPath.beginning_product_reference
          if (beginningRef && affectedIds.has(beginningRef)) {
            return true
          }
          continue
        }

        // Find the product path (if any) that represents the path leading up
        // to (but not including) the relationship.
        for (const candidate of productPaths.values()) {
          const candidateSubpaths = candidate.subpaths ?? []
          if (
            candidateSubpaths.length !== i ||
            candidate.beginning_product_reference !==
              productPath.beginning_product_reference
          ) {
            continue
          }
          const isPrefix = candidateSubpaths.every(
            (s, index) =>
              s.category === subpaths[index].category &&
              s.next_product_reference ===
                subpaths[index].next_product_reference
          )
          if (!isPrefix) continue

          const candidateId = candidate.full_product_name?.product_id
          if (candidateId && affectedIds.has(candidateId)) {
            return true
          }
        }
      }
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

      const hasCorrespondence =
        [...affectedIds].some((affectedId) =>
          isCorrespondingProduct(id, affectedId)
        ) || hasInstalledWithCorrespondence(id, affectedIds)

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
