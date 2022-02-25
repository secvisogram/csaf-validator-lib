const checkForUnsafeHashAlgorithms = require('./shared/checkForUnsafeHashAlgorithms.js')

/**
 * @param {any} doc
 */
module.exports = function optionalTest_6_2_9(doc) {
  return checkForUnsafeHashAlgorithms(doc, 'sha1')
}
