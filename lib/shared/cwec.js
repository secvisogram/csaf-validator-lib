import * as cwe from '#lib/cwec.js'

const latestCatalogueFn = Array.from(cwe.cwecMap.values()).at(0)
const latestCatalogue = /** @type {import('#lib/cwec.js').CweCatalogue} */ (
  (await latestCatalogueFn?.())?.default
)

export default /** @type {const} */ ({
  weaknesses: latestCatalogue.weaknesses,
})
