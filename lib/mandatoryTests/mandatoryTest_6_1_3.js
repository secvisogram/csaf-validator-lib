/**
 * @typedef {object} FullProductName
 * @property {unknown} product_id
 */

/**
 * @typedef {object} Relationship
 * @property {unknown} relates_to_product_reference
 * @property {unknown} product_reference
 * @property {FullProductName | null} [full_product_name]
 */

/**
 * @param {any} doc
 */
export default function mandatoryTest_6_1_3(doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (!Array.isArray(doc.product_tree?.relationships)) {
    return { isValid, errors }
  }

  /** @type {Array<Relationship>} */
  const relationships = doc.product_tree.relationships

  // keeps the first index per product id, like the former findIndex lookup
  /** @type {Map<unknown, number>} */
  const indexByProductId = new Map()
  relationships.forEach((relationship, index) => {
    const productId = relationship.full_product_name?.product_id
    if (!indexByProductId.has(productId)) {
      indexByProductId.set(productId, index)
    }
  })

  relationships.forEach((_, index) => {
    /** @type {Set<string>} */
    const erroredAttributeSet = new Set()
    search([], relationships, indexByProductId, index, null, ({ key }) => {
      if (typeof key === 'string' && !erroredAttributeSet.has(key)) {
        erroredAttributeSet.add(key)
        isValid = false
        errors.push({
          instancePath: `/product_tree/relationships/${index}/${key}`,
          message: 'circular reference',
        })
      }
    })
  })

  return { isValid, errors }
}

/**
 * @param {number[]} path
 * @param {Relationship[]} relationships
 * @param {Map<unknown, number>} indexByProductId
 * @param {number} index
 * @param {string | null} key
 * @param {(params: { key: string | null }) => void} onCycle
 * @returns
 */
function search(path, relationships, indexByProductId, index, key, onCycle) {
  const relationship = relationships[index]
  if (
    typeof relationship.full_product_name?.product_id === 'string' &&
    path.includes(index)
  ) {
    return onCycle({ key })
  }

  if (typeof relationship.product_reference === 'string') {
    const productRelationshipIndex =
      indexByProductId.get(relationship.product_reference) ?? -1
    if (productRelationshipIndex !== -1) {
      search(
        [...path, index],
        relationships,
        indexByProductId,
        productRelationshipIndex,
        key ?? 'product_reference',
        onCycle
      )
    }
  }

  if (typeof relationship.relates_to_product_reference === 'string') {
    const relatesToProductRelationshipIndex =
      indexByProductId.get(relationship.relates_to_product_reference) ?? -1
    if (relatesToProductRelationshipIndex !== -1) {
      search(
        [...path, index],
        relationships,
        indexByProductId,
        relatesToProductRelationshipIndex,
        key ?? 'relates_to_product_reference',
        onCycle
      )
    }
  }
}
