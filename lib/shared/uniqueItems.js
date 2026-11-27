import { _ } from 'ajv/dist/2020.js'

/**
 * Lists shorter than this keep going straight to Ajv's own comparison, which
 * is about as fast for them.
 */
const MIN_LENGTH = 16

/**
 * Returns `true` only if no item is an object or an array and no two items
 * are the same value. Values are compared the way Ajv's pairwise comparison
 * (`fast-deep-equal`) compares primitives: `===`, with `NaN` equal to `NaN`.
 * That is what a `Set` does.
 *
 * @param {unknown[]} list
 */
export function hasOnlyDistinctPrimitives(list) {
  const seen = new Set()
  for (let i = 0; i < list.length; ++i) {
    const item = list[i]
    if ((typeof item === 'object' && item !== null) || seen.has(item)) {
      return false
    }
    seen.add(item)
  }
  return true
}

/**
 * Speeds up `uniqueItems` for long lists whose item type is only known through
 * a `$ref` (e.g. `products_t`). For those, Ajv compares every item with every
 * other item. This wraps Ajv's own `uniqueItems` code in a check that skips it
 * for lists that are known to hold only distinct primitives, for which it
 * cannot report anything. Every other list (short lists, lists with an object,
 * an array or two equal values) runs Ajv's unchanged code, so results and
 * error messages stay the same. Lists whose `items` have a `type` of their
 * own, `uniqueItems: false`, `$data` and code generated without `allErrors`
 * are left as they are.
 *
 * @param {import('ajv/dist/2020.js').Ajv2020} ajv
 * @returns {boolean} whether the check was added
 */
export default function addUniqueItemsPrecheck(ajv) {
  const definition = ajv.getKeyword('uniqueItems')
  if (typeof definition !== 'object' || !('code' in definition)) return false
  const code = definition.code
  definition.code = (cxt, ruleType) => {
    const items = cxt.parentSchema.items
    const itemsHaveOwnType =
      typeof items === 'object' && items !== null && items.type !== undefined
    if (
      cxt.schema !== true ||
      cxt.$data ||
      !cxt.allErrors ||
      itemsHaveOwnType
    ) {
      return code(cxt, ruleType)
    }
    // A prefix of its own keeps the names of Ajv's own helpers unchanged.
    const isDistinct = cxt.gen.scopeValue('keyword', {
      ref: hasOnlyDistinctPrimitives,
    })
    cxt.gen.if(
      _`${cxt.data}.length < ${MIN_LENGTH} || !${isDistinct}(${cxt.data})`,
      () => code(cxt, ruleType)
    )
  }
  return true
}
