const checkForUnsafeHashAlgorithms = require('./shared/checkForUnsafeHashAlgorithms.js')

/**
 * @param {any} doc
 */
module.exports = function (doc) {
  return checkForUnsafeHashAlgorithms(doc, 'sha1')
}
