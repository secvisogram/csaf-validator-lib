import { walkHashes } from '../shared/csafHelpers/walkHashes.js'
import {
  ALGORITHMS_IN_SPEC,
  SECURE_ALGORITHMS,
} from '../shared/csafHelpers/hashAlgorithms.js'

/**
 * This implements the recommended test 6.2.52 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 */
export function recommendedTest_6_2_52(doc) {
  const ctx = {
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
  }

  walkHashes(doc, ({ path, hash }) => {
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      const { algorithm } = fileHash
      if (typeof algorithm !== 'string') return

      const instancePath = `${path}/${fileHashIndex}/algorithm`

      if (ALGORITHMS_IN_SPEC.has(algorithm)) {
        if (!SECURE_ALGORITHMS.has(algorithm)) {
          ctx.warnings.push({
            instancePath,
            message: `the hash algorithm '${algorithm}' is listed in section 3.1.4.3.2 but is not considered a secure cryptographic hash algorithm; a secure algorithm SHOULD be preferred`,
          })
        }
      } else {
        ctx.warnings.push({
          instancePath,
          message: `the hash algorithm '${algorithm}' is not listed in section 3.1.4.3.2`,
        })
      }
    })
  })

  return ctx
}
