/**
 * All hash algorithm names mentioned in section 3.1.10.3.2 of the CSAF 2.1 standard.
 * These are derived from the OpenSSL dgst -list output (version 3.4.0,
 * 2024-10-22) with leading dashes removed.
 */
export const ALGORITHMS_IN_SPEC = new Set([
  'blake2b512',
  'blake2s256',
  'md4',
  'md5',
  'md5-sha1',
  'mdc2',
  'ripemd',
  'ripemd160',
  'rmd160',
  'sha1',
  'sha224',
  'sha256',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha384',
  'sha512',
  'sha512-224',
  'sha512-256',
  'shake128',
  'shake256',
  'sm3',
  'ssl3-md5',
  'ssl3-sha1',
  'whirlpool',
])

/**
 * Subset of ALGORITHMS_IN_SPEC considered cryptographically secure,
 * based on the OpenSSL 3.x provider classification:
 * - Algorithms requiring the legacy provider (md4, mdc2, ripemd*, whirlpool)
 *   are excluded.
 * - Algorithms in the default provider but cryptographically broken or
 *   deprecated (md5, md5-sha1, sha1, ssl3-md5, ssl3-sha1) are excluded.
 * - All remaining default-provider algorithms are considered secure.
 */
export const SECURE_ALGORITHMS = new Set([
  'blake2b512',
  'blake2s256',
  'sha224',
  'sha256',
  'sha3-224',
  'sha3-256',
  'sha3-384',
  'sha3-512',
  'sha384',
  'sha512',
  'sha512-224',
  'sha512-256',
  'shake128',
  'shake256',
  'sm3',
])

/**
 * Subset of algorithms that support variable-length (XOF) output.
 */
export const VARIABLE_LENGTH_ALGORITHMS = new Set(['shake128', 'shake256'])

/**
 * Expected hash value length in hexadecimal characters for each algorithm.
 *
 * @type {Record<string, number>}
 */
export const HASH_ALGORITHM_LENGTHS = {
  md4: 32,
  md5: 32,
  mdc2: 32,
  'ssl3-md5': 32,
  ripemd: 40,
  ripemd160: 40,
  rmd160: 40,
  sha1: 40,
  'ssl3-sha1': 40,
  sha224: 56,
  'sha3-224': 56,
  'sha512-224': 56,
  sha256: 64,
  'sha3-256': 64,
  'sha512-256': 64,
  sm3: 64,
  blake2s256: 64,
  'md5-sha1': 72,
  sha384: 96,
  'sha3-384': 96,
  sha512: 128,
  'sha3-512': 128,
  blake2b512: 128,
  whirlpool: 128,
}
