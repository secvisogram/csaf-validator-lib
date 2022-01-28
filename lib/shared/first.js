/** @type {any} */
const cvss30 = require('./first/cvsscalc30')
/** @type {any} */
const cvss31 = require('./first/cvsscalc31')

exports.cvss30 = /** @type {import('./first/types').CVSS30} */ (cvss30)
exports.cvss31 = /** @type {import('./first/types').CVSS31} */ (cvss31)
