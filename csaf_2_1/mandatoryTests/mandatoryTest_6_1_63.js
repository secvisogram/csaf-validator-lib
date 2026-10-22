import { walkHashes } from '../shared/csafHelpers/walkHashes.js'
import {
  ALGORITHMS_IN_SPEC,
  HASH_ALGORITHM_LENGTHS,
  VARIABLE_LENGTH_ALGORITHMS,
} from '../shared/csafHelpers/hashAlgorithms.js'

/**
 * This implements the mandatory test 6.1.63 of the CSAF 2.1 standard.
 *
 * @param {unknown} doc
 * @returns
 */
export function mandatoryTest_6_1_63(doc) {
  const ctx = {
    errors:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    warnings:
      /** @type {Array<{ instancePath: string; message: string }>} */ ([]),
    isValid: true,
  }

  walkHashes(doc, ({ path, hash }) => {
    hash.file_hashes.forEach((fileHash, fileHashIndex) => {
      const { algorithm, value } = fileHash
      if (typeof algorithm !== 'string' || typeof value !== 'string') return

      if (VARIABLE_LENGTH_ALGORITHMS.has(algorithm)) {
        // Algorithms with variable length output can't be checked for a
        // fixed expected length.
        return
      }

      const expectedLength = HASH_ALGORITHM_LENGTHS[algorithm]
      if (expectedLength === undefined) {
        ctx.warnings.push({
          instancePath: `${path}/${fileHashIndex}/algorithm`,
          message: ALGORITHMS_IN_SPEC.has(algorithm)
            ? `the hash algorithm '${algorithm}' is specified in section 3.1.10.3.2 but is not supported by this implementation.`
            : `the hash algorithm '${algorithm}' is not specified in section 3.1.10.3.2 and is not supported by this implementation.`,
        })
        return
      }

      if (value.length !== expectedLength) {
        ctx.isValid = false
        ctx.errors.push({
          instancePath: `${path}/${fileHashIndex}/value`,
          message: `hash value has ${value.length} characters, but algorithm '${algorithm}' requires exactly ${expectedLength} characters`,
        })
      }
    })
  })

  return ctx
}
